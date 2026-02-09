import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Table, 
  message, 
  Typography,
  Space,
  Statistic,
  Row,
  Col,
  Progress,
  Tag,
  Tooltip,
  Modal,
  Input,
  Select,
  Form,
  InputNumber,
  DatePicker,
  ConfigProvider,
  Spin
} from 'antd';
import { exportToTallyXML } from '../utils/tallyXmlGenerator';
import { 
  InboxOutlined, 
  FileTextOutlined,
  DownloadOutlined,
  LockOutlined,
  ReloadOutlined,
  BankOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment-timezone';
import { API_URL } from '../utils/api';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { confirm } = Modal;
const { Option } = Select;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  index, // Destructure index to avoid DOM warning and use in save
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      if(inputRef.current) {
         inputRef.current.focus();
      }
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    
    // Set initial values including parsing dates
    let val = record[dataIndex];
    if (dataIndex === 'date' && val) {
       val = moment(val, ['DD-MM-YYYY', 'YYYY-MM-DD', moment.ISO_8601]);
    }
    
    form.setFieldsValue({
      [dataIndex]: val,
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      let newValue = values[dataIndex];

      // Format Date back to string if needed
      if (dataIndex === 'date' && newValue) {
        newValue = newValue.format('DD-MM-YYYY');
      }

      toggleEdit();
      if (record[dataIndex] != newValue) {
         // Pass index to handleSave
         handleSave({ ...record, [dataIndex]: newValue }, dataIndex, record[dataIndex], newValue, index);
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: dataIndex !== 'remarks', // Remarks optional
            message: `${title} is required.`,
          },
        ]}
      >
        {renderInput()}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24, cursor: 'pointer' }}
        onDoubleClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  function renderInput() {
    if (dataIndex === 'date') {
       return (
         <DatePicker 
           ref={inputRef} 
           format="DD-MM-YYYY" 
           inputReadOnly={true}
           onOpenChange={(open) => {
             if (!open) {
               save();
             }
           }}
         />
       ); 
       // Note: DatePicker autoFocus might act weird, need careful focus handling usually, 
       // but for now let's try standard. onBlur on DatePicker can be tricky (triggers on panel open sometimes).
       // A safer bet for DatePicker is explicit enter or clicking away? 
       // Actually let's use default behavior, onBlur might close edit mode too early if selecting date.
       // We'll trust user to press Enter or click outside? 
       // Actually 'onBlur' on DatePicker wrapper often fires when popup opens. 
       // Providing `open={true}` might be needed or handling `onOpenChange`.
       // For simplicity, let's assume standard behavior: user picks date then clicks away?
       // Let's rely on `onBlur={save}`.
    }
    if (dataIndex === 'type') {
       return (
         <Select 
           ref={inputRef} 
           onBlur={save} 
           autoFocus
         >
           <Option value="DEBIT">DEBIT</Option>
           <Option value="CREDIT">CREDIT</Option>
         </Select>
       );
    }
    if (dataIndex === 'amount' || dataIndex === 'balance') {
       return <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} style={{ width: '100%' }} />;
    }
    return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
  }

  return <td {...restProps}>{childNode}</td>;
};

const SimpleUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null); // For modal
  const [isFullScreen, setIsFullScreen] = useState(false); // Full Screen Toggle

  // Accuracy / Integrity Data
  const [integrityData, setIntegrityData] = useState(null);
  const [tallyModalVisible, setTallyModalVisible] = useState(false);
  const [tallyLedgerName, setTallyLedgerName] = useState('');
  
  // Bank Selection State
  const [selectedBank, setSelectedBank] = useState(undefined); // Start with no selection
  
  // Password Handling State
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [filePassword, setFilePassword] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const containerRef = useRef(null);

  const bankOptions = [
    "UNION BANK OF INDIA",
    "HDFC BANK",
    "ICICI BANK", 
    "KARNAVATI BANK",
    "KOTAK MAHINDRA BANK",
  ];

  const uploadProps = {
    name: 'statement',
    multiple: false,
    accept: '.pdf',
    // Disable if no bank selected
    disabled: !selectedBank, 
    beforeUpload: (file) => {
      if (!selectedBank) {
        message.warning('Please select a bank first!');
        return false;
      }
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('You can only upload PDF files!');
        return false;
      }
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('PDF must be smaller than 50MB!');
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      // Double check just in case
      if (!selectedBank) {
        message.warning('Please select a bank format first.');
        onError(new Error('No Bank Selected'));
        return;
      }

      setUploading(true);
      setResult(null);
      await processUpload(file);
    },
    showUploadList: false
  };

  const processUpload = async (fileObject, password = null) => {
    const formData = new FormData();
    formData.append('statement', fileObject);
    formData.append('bankName', selectedBank);
    if (password) formData.append('password', password);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/simple/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errJson;
        try { errJson = JSON.parse(errorText); } catch (e) { errJson = { message: errorText }; }
        
        if (response.status === 422 || (errJson.message && errJson.message.includes("Password"))) {
            setPendingFile(fileObject);
            setPasswordModalVisible(true);
            message.warning('This file is password protected. Please enter the password.');
            setUploading(false);
            return;
        }
        throw new Error(errJson.message || 'Processing failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalizedResult = { transactions: [], documentmetadata: {}, Accuracy: {} };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === 'metadata') {
              finalizedResult.documentmetadata = data.documentmetadata;
              finalizedResult.bank = data.bank;
              setResult(prev => ({ ...prev, ...finalizedResult }));
            } 
            else if (data.type === 'page_data') {
              finalizedResult.transactions = [...finalizedResult.transactions, ...(data.transactions || [])];
              setResult(prev => ({
                ...prev,
                transactions: finalizedResult.transactions,
                documentmetadata: finalizedResult.documentmetadata,
                bank: finalizedResult.bank
              }));
            }
            else if (data.type === 'accuracy') {
              finalizedResult.Accuracy = data.accuracy;
              setResult(prev => ({
                ...prev,
                Accuracy: data.accuracy
              }));
            }
            else if (data.type === 'error') throw new Error(data.message);
          } catch (e) { console.error("Error parsing NDJSON line:", e); }
        }
      }

      message.success('Statement processed successfully!');
      setUploadProgress(0);
      setPasswordModalVisible(false);
      setFilePassword('');
      setPendingFile(null);

    } catch (error) {
      message.error(error.message || 'Processing failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };



  const handleSave = (row, dataIndex, oldValue, newValue, index) => {
    confirm({
      title: 'Confirm Update',
      icon: <ReloadOutlined style={{ color: '#faad14' }} />,
      content: (
        <div>
           <p>Are you sure you want to update this value?</p>
           <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Old Value:</Text>
                <div style={{ textDecoration: 'line-through', color: '#999' }}>{oldValue || '(Empty)'}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>New Value:</Text>
                <div style={{ color: '#52c41a', fontWeight: 600 }}>{newValue}</div>
              </div>
           </div>
        </div>
      ),
      onOk() {
        const newData = [...result.transactions];
        // Use index to find item
        const item = newData[index];
        const updatedItem = { ...item, ...row };

        newData.splice(index, 1, updatedItem);
        setResult({ ...result, transactions: newData });
        message.success('Value updated (Local Session Only)');
      }
    });
  };

  const handleDelete = (index) => {
    confirm({
      title: 'Delete Transaction',
      icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Are you sure you want to delete this transaction?',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const newData = [...result.transactions];
        newData.splice(index, 1);
        setResult({ ...result, transactions: newData });
        message.success('Transaction deleted');
      },
    });
  };

  const handleAdd = (index) => {
    confirm({
      title: 'Add New Transaction',
      icon: <PlusCircleOutlined style={{ color: '#1890ff' }} />,
      content: 'Insert a new empty transaction here?',
      okText: 'Yes, Insert',
      cancelText: 'Cancel',
      onOk() {
        const newData = [...result.transactions];
        const newTransaction = {
          date: moment().format('DD-MM-YYYY'),
          txnId: 'NEW',
          remarks: 'New Transaction',
          amount: 0.0,
          balance: 0.0,
          type: 'DEBIT',
        };
        // Insert AT index (pushing current generic index down)
        newData.splice(index, 0, newTransaction);
        setResult({ ...result, transactions: newData });
        message.success('New transaction added');
      },
    });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // Generate dynamic columns based on actual data
  const getColumns = () => {
    if (!result || !result.transactions || result.transactions.length === 0) {
      return [];
    }

    // Calculate dynamic width for Amount column
    let maxAmountWidth = 120; // Default minimum
    if (result.transactions.length > 0) {
      const maxLen = result.transactions.reduce((max, txn) => {
        if (txn.amount === null || txn.amount === undefined) return max;
        // Replicate format logic roughly to guess length
        const len = (txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length) + 2; // +2 for symbol/sign
        return len > max ? len : max;
      }, 0);
      maxAmountWidth = Math.max(120, maxLen * 10); // Approx 10px per char
    }

    // Standardized columns for the new schema
    // Added 'editable: true' to all fields request by user
    const baseColumns = [
     
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: 140, 
        fixed: 'left',
        editable: true,
        // Remove ellipsis for date if we want simpler edit view or keep it? 
        // Keep it.
        render: (date) => {
          if (!date) return <Text type="secondary">-</Text>;
          // Backend now ensures DD-MM-YYYY format or returns raw string
          return (
            <Tooltip placement="topLeft" title={date}>
              <Text style={{ color: 'var(--text-primary)' }}>
                {date}
              </Text>
            </Tooltip>
          );
        },
        sorter: (a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date) - new Date(b.date);
        }
      },
      {
        title: 'Transaction ID',
        dataIndex: 'txnId',
        key: 'txnId',
        width: 180, 
        editable: true,
        ellipsis: true, 
        render: (text) => {
          if (!text) return <Text type="secondary">-</Text>;
          return (
            <Tooltip placement="topLeft" title={text}>
              <Text>{text}</Text>
            </Tooltip>
          );
        }
      },
      {
        title: 'Remarks',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 400,
        editable: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
             <Text style={{ color: '#4a4a4a' }}>{text || '-'}</Text>
          </Tooltip>
        )
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 110,
        editable: true,
        render: (type) => {
          let color = 'default';
          if (type === 'DEBIT') color = 'red';
          if (type === 'CREDIT') color = 'green';
          return (
            <Tooltip title={type}>
              <Tag color={color} key={type}>
                {type}
              </Tag>
            </Tooltip>
          );
        }
      },
      {
        title: 'Amount (₹)',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: maxAmountWidth,
        editable: true,
        render: (amount, record) => {
          if (amount === null || amount === undefined) {
            return <Text type="secondary">-</Text>;
          }
          const isDebit = record.type === 'DEBIT';
          const color = isDebit ? 'cf1322' : '3f8600'; // Darker red/green for text
          const formatted = `${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          
          return (
            <Tooltip title={formatted}>
              <Text style={{ color: `#${color}`, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatted}
              </Text>
            </Tooltip>
          );
        }
      },
      {
        title: 'Balance (₹)',
        dataIndex: 'balance',
        key: 'balance',
        width: 160,
        align: 'right',
        editable: true,
        render: (balance) => {
          if (balance === null || balance === undefined) {
            return <Text type="secondary">-</Text>;
          }
          const formatted = `${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          return (
            <Tooltip title={formatted}>
              <Text style={{ color: 'var(--text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatted}
              </Text>
            </Tooltip>
          );
        }
      }, {
        title: <span style={{ whiteSpace: 'nowrap' }}>Actions</span>,
        key: 'actions',
        fixed: 'right',
        width: 100,
        align: 'center',
        render: (_, __, index) => (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            border: '1px solid #d9d9d9', 
            borderRadius: '4px',
            overflow: 'hidden',
            width: '60px',
            margin: '0 auto'
          }}>
            {/* Top Left: Add Above */}
            <Tooltip title="Add Row Above">
              <div 
                onClick={() => handleAdd(index)}
                style={{
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: '1px solid #d9d9d9',
                  borderBottom: '1px solid #d9d9d9',
                  cursor: 'pointer',
                  background: '#f6ffed'
                }}
              >
                <ArrowUpOutlined style={{ fontSize: '12px', color: '#52c41a' }} />
              </div>
            </Tooltip>

            {/* Top Right: Add Below */}
            <Tooltip title="Add Row Below">
              <div 
                onClick={() => handleAdd(index + 1)}
                style={{
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #d9d9d9',
                  cursor: 'pointer',
                  background: '#e6f7ff'
                }}
              >
                <ArrowDownOutlined style={{ fontSize: '12px', color: '#1890ff' }} />
              </div>
            </Tooltip>

            {/* Bottom Left: Delete */}
            <Tooltip title="Delete Row">
              <div 
                onClick={() => handleDelete(index)}
                style={{
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: '1px solid #d9d9d9',
                  cursor: 'pointer',
                  background: '#fff1f0'
                }}
              >
                <DeleteOutlined style={{ fontSize: '12px', color: '#ff4d4f' }} />
              </div>
            </Tooltip>

            {/* Bottom Right: Edit (Info) */}
            <Tooltip title="Double Click into the box to edit any transaction.">
              <div 
                style={{
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'help',
                  background: '#fafafa'
                }}
              >
                <EditOutlined style={{ fontSize: '12px', color: '#595959' }} />
              </div>
            </Tooltip>
          </div>
        )
      },
    ];

    return baseColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, index) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
          index, // Pass index to onCell props
        }),
      };
    });
  };

  const columns = getColumns();

  const handleExportCSV = () => {
    if (!result || !result.transactions || result.transactions.length === 0) return;

    const firstRow = result.transactions[0];
    const csvRows = [];
    
    // Build header row
    const headers = ['Page', 'Table'];
    if (firstRow.columns) {
      headers.push(...Object.keys(firstRow.columns));
    }
    csvRows.push(headers.join(','));
    
    // Build data rows
    result.transactions.forEach(txn => {
      const row = [
        txn.pageNumber || '',
        txn.tableNumber || ''
      ];
      
      if (txn.columns) {
        Object.values(txn.columns).forEach(value => {
          // Escape commas and quotes in CSV
          const escaped = String(value || '').replace(/"/g, '""');
          row.push(`"${escaped}"`);
        });
      }
      
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_tables_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    message.success('CSV exported successfully!');
  };

  const handleOpenTallyModal = () => {
    // Default to Metadata Bank Name or "Bank Account"
    const defaultName = result.metadata?.bankName || 'Bank Account';
    setTallyLedgerName(defaultName);
    setTallyModalVisible(true);
  };

  const handleTallyDownload = () => {
    try {
      if (!result || !result.transactions) return;
      
      const xmlData = exportToTallyXML(result.transactions, tallyLedgerName);
      const blob = new Blob([xmlData], { type: 'text/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Sanitized filename
      const safeBankName = tallyLedgerName.replace(/[^a-z0-9]/gi, '_');
      a.download = `Tally_Import_${safeBankName}.xml`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      message.success('Tally XML generated successfully!');
      setTallyModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error('Failed to generate XML');
    }
  };

  const handleResetCheck = () => {
    confirm({
      title: 'Upload New Statement?',
      icon: <FileTextOutlined style={{ color: '#5B4EF5' }} />,
      content: 'Uploading a new statement will clear the current extracted data. Are you sure you want to proceed?',
      okText: 'Yes, Upload New',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        setResult(null);
        setUploadProgress(0);
      },
    });
  };

  const handlePasswordSubmit = async () => {
    if (!filePassword) {
      message.error('Please enter a password');
      return;
    }
    
    setUploading(true);
    await processUpload(pendingFile, filePassword);
  };

  return (
    <div style={{ padding: '20px 40px', maxWidth: '100%', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' }}>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-point {
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>
      
      {/* Upload Section - Hidden when results are shown */}
      {!result && (
        <>
        <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '1000px', margin: '0 auto 32px auto' }}>
            <h1 style={{ 
              fontSize: '40px', 
              fontWeight: 950, 
              color: '#0f172a', 
              marginBottom: '8px',
              lineHeight: '1.05',
              letterSpacing: '-0.05em'
            }}>
              Convert PDF Bank Statement
            </h1>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              color: '#0ea5e9', 
              marginBottom: '32px',
              marginTop: '0'
            }}>
              Into Tally XML or Excel
            </h2>

            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              {[
                "Please use original, bank-issued PDF statements and include all pages for optimal accuracy.",
                "If your file is protected, please keep the password active; our system handles encrypted files securely.",
                "Digital PDF formats are required. Scanned documents or images are not supported at this time."
              ].map((text, i) => (
                <div 
                  key={i}
                  className="animate-point"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    padding: '12px 20px',
                    background: 'white',
                    border: '1px solid #fee2e2',
                    borderLeft: '4px solid #ef4444',
                    borderRadius: '10px',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 500,
                    animationDelay: `${i * 0.15}s`,
                    opacity: 0,
                    boxShadow: '0 2px 10px rgba(239, 68, 68, 0.04)'
                  }}
                >
                  <div style={{
                    minWidth: '24px',
                    height: '24px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800
                  }}>{i + 1}</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #E0E0E0', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
             <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1A1A1A', fontSize: '15px' }}>Select Bank Format</Text>
                  <Select
                    style={{ width: '100%', height: '48px' }}
                    size="large"
                    placeholder="Choose your bank to start"
                    value={selectedBank}
                    onChange={setSelectedBank}
                    allowClear
                    className="custom-bank-select"
                    dropdownStyle={{ padding: '8px' }}
                    getPopupContainer={() => containerRef.current || document.body}
                  >
                    {bankOptions.map(bank => (
                      <Option key={bank} value={bank} style={{ padding: '10px 20px' }}>
                        <Space style={{ fontSize: '15px', fontWeight: 500 }}>
                          <BankOutlined style={{ fontSize: '16px', color: '#0ea5e9' }} />
                          {bank}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </div>

                {!selectedBank && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px', 
                    background: '#f8fafc', 
                    borderRadius: '16px', 
                    color: '#64748b',
                    marginBottom: '8px',
                    border: '2px dashed #e2e8f0'
                  }}>
                    <BankOutlined style={{ fontSize: '32px', marginBottom: '16px', color: '#94a3b8' }} />
                    <p style={{ fontSize: '17px', fontWeight: 500, margin: 0, color: '#475569' }}>
                      Please select a bank format to enable file processing.
                    </p>
                  </div>
                )}

                {selectedBank && (
                <Dragger 
                  {...uploadProps} 
                  disabled={uploading || !selectedBank}
                  style={{
                    background: '#f0f9ff',
                    border: '2px dashed #0369a1',
                    borderRadius: '16px',
                    padding: '24px 0',
                    transition: 'all 0.3s ease'
                  }}
                  className="custom-dragger"
                >
                   <div style={{ padding: '12px 0' }}>
                     <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ fontSize: '48px', color: '#0ea5e9' }} />
                     </p>
                     <p className="ant-upload-text" style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '16px' }}>
                       Drop your PDF here OR click to browse
                     </p>
                     <p className="ant-upload-hint" style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
                       Secure processing for bank PDFs up to 50MB
                     </p>
                   </div>
                </Dragger>
                )}

                {uploading && (
                  <div style={{ marginTop: '24px' }}>
                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>Analyzing Document In Real-Time...</Text>
                    <Progress 
                      percent={uploadProgress} 
                      status="active"
                      strokeColor={{
                        '0%': '#0ea5e9',
                        '100%': '#0369a1',
                      }}
                      strokeWidth={8}
                    />
                  </div>
                )}
             </div>
          </div>

          
        </>
      )}

      {/* Results Section - Full Screen Focus on Table */}
      <ConfigProvider getPopupContainer={() => containerRef.current || document.body}>
        <div ref={containerRef} className="results-container">
          {result && (
            <Spin spinning={uploading} tip="Processing pages..." size="large">
              <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             {/* Left Side: File Info (One Line) */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
                <Space>
                   <Text type="secondary">File:</Text>
                   <Text strong style={{ color: '#1A1A1A' }}>{result.documentmetadata?.filename || result.fileName || 'Unknown File'}</Text>
                </Space>
                <div style={{ width: '1px', height: '16px', background: '#D9D9D9' }} />
                <Space>
                   <Text type="secondary">Pages:</Text>
                   <Text strong style={{ color: '#1A1A1A' }}>{result.documentmetadata?.page_count || result.pageCount || 'N/A'}</Text>
                </Space>
             </div>

             {/* Right Side: Upload New Button */}
             <Button 
                onClick={handleResetCheck}
                icon={<ReloadOutlined />}
                size="middle"
                type="primary"
                style={{ 
                  borderRadius: '6px',
                  backgroundColor: '#5B4EF5',
                  borderColor: '#5B4EF5',
                  fontWeight: 500
                }}
              >
                Upload New Statement
             </Button>
          </div>
          
          {/* Compact Integrity Banner */}
          {/* Accuracy Status Bar */}
          {result.Accuracy && (
            <div style={{
              background: result.Accuracy.isAccurate ? '#f6ffed' : '#fff1f0',
              border: `1px solid ${result.Accuracy.isAccurate ? '#b7eb8f' : '#ffa39e'}`,
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {result.Accuracy.isAccurate ? (
                    <CheckCircleFilled style={{ color: '#52c41a', fontSize: '18px' }} />
                  ) : (
                    <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '18px' }} />
                  )}
                  <Text strong style={{ fontSize: '15px' }}>
                    {result.Accuracy.isAccurate ? 'Financial Integrity Verified' : 'Financial Discrepancy Detected'}
                  </Text>
               </div>
               
               <Space size={24}>
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Opening Balance</Text>
                    <Text strong>₹{parseFloat(result.Accuracy.openingBalance).toLocaleString('en-IN')}</Text>
                  </Space>
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Calculated Closing</Text>
                    <Text strong>₹{parseFloat(result.Accuracy.calculatedClosingBalance).toLocaleString('en-IN')}</Text>
                  </Space>
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Actual Closing</Text>
                    <Text strong style={{ 
                       color: result.Accuracy.isAccurate ? 'inherit' : '#ff4d4f' 
                    }}>
                      ₹{parseFloat(result.Accuracy.closingBalance).toLocaleString('en-IN')}
                    </Text>
                  </Space>
               </Space>
            </div>
          )}

          {/* Transactions Table - Main Focus */}
          <Card 
            bordered
            bodyStyle={{ padding: 0 }} // Remove padding for cleaner full-table look
            style={isFullScreen ? {
               position: 'fixed',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               zIndex: 2000,
               width: '100vw',
               height: '100vh',
               borderRadius: 0,
               overflow: 'hidden',
               display: 'flex',
               flexDirection: 'column'
            } : { 
              borderColor: '#e0e0e0', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden' 
            }}
          >
            {/* Custom Header for Table */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Text strong style={{ fontSize: '18px' }}>Extracted Transaction Data</Text>
                  <Tag color="blue">{result.transactions.length} rows</Tag>
                </Space>
                <Space>
                  <Button onClick={handleOpenTallyModal} type="primary" ghost style={{ borderColor: '#ffa940', color: '#ffa940' }}>
                     Download Tally XML
                  </Button>
                   <Button icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={() => setIsFullScreen(!isFullScreen)}>
                      {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                   </Button>
                   <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
                      Export CSV
                   </Button>
                </Space>
            </div>
            
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              size={isFullScreen ? "middle" : "small"}
              columns={columns}
              dataSource={result.transactions}
              rowKey={(record, index) => index}
              pagination={false}
              bordered
              sticky
              scroll={{ x: 'max-content', y: isFullScreen ? 'calc(100vh - 120px)' : 600 }}
              />
            </Card>
          </>
          </Spin>
          )}

      {/* Modals */}
      <Modal
        title="Export to Tally XML"
        open={tallyModalVisible}
        onOk={handleTallyDownload}
        onCancel={() => setTallyModalVisible(false)}
        okText="Download XML"
        cancelText="Cancel"
        getPopupContainer={() => containerRef.current || document.body}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Bank Ledger Name in Tally</Text>
          <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 8px' }}>
            Enter the exact name of the Bank Ledger as it appears in your Tally company (e.g. "HDFC Bank A/c").
          </p>
          <Input 
            value={tallyLedgerName} 
            onChange={(e) => setTallyLedgerName(e.target.value)} 
            placeholder="e.g. Union Bank of India"
          />
        </div>
        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Note: This will generate a 'Journal' voucher for each transaction. 
            Contra ledger is set to "Suspense Account".
          </Text>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal
        title={
          <Space>
            <LockOutlined style={{ color: '#faad14' }} />
            <span>Password Required</span>
          </Space>
        }
        open={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setPasswordModalVisible(false);
          setPendingFile(null);
          setFilePassword('');
        }}
        okText="Unlock & Process"
        confirmLoading={uploading}
        getPopupContainer={() => containerRef.current || document.body}
      >
         <div style={{ padding: '20px 0' }}>
           <Text>This PDF file is password protected. Please enter the password to unlock and process it.</Text>
           <Input.Password
             style={{ marginTop: '16px' }}
             placeholder="Enter PDF Password"
             value={filePassword}
             onChange={(e) => setFilePassword(e.target.value)}
             onPressEnter={handlePasswordSubmit}
           />
         </div>
      </Modal>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default SimpleUpload;
