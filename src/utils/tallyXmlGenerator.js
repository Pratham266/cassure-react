
export const exportToTallyXML = (transactions, bankLedgerName) => {
  const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe.toString().replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const SUSPENSE_LEDGER_DEF = `
            <TALLYMESSAGE xmlns:UDF="TallyUDF">
                <LEDGER NAME="Suspense" RESERVEDNAME="">
                    <CURRENCYNAME>₹</CURRENCYNAME>
                    <PARENT>Suspense A/c</PARENT>
                    <TAXCLASSIFICATIONNAME/>
                    <TAXTYPE>Others</TAXTYPE>
                    <LEDADDLALLOCTYPE/>
                    <GSTTYPE/>
                    <APPROPRIATEFOR/>
                    <SERVICECATEGORY>&#4; Not Applicable</SERVICECATEGORY>
                    <EXCISELEDGERCLASSIFICATION/>
                    <EXCISEDUTYTYPE/>
                    <EXCISENATUREOFPURCHASE/>
                    <LEDGERFBTCATEGORY/>
                    <BANKACCHOLDERNAME>Abc Creation</BANKACCHOLDERNAME>
                    <ISBILLWISEON>No</ISBILLWISEON>
                    <ISCOSTCENTRESON>No</ISCOSTCENTRESON>
                    <ISINTERESTON>No</ISINTERESTON>
                    <ALLOWINMOBILE>No</ALLOWINMOBILE>
                    <ISCOSTTRACKINGON>No</ISCOSTTRACKINGON>
                    <ISBENEFICIARYCODEON>No</ISBENEFICIARYCODEON>
                    <ISEXPORTONVCHCREATE>No</ISEXPORTONVCHCREATE>
                    <PLASINCOMEEXPENSE>No</PLASINCOMEEXPENSE>
                    <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
                    <ISDELETED>No</ISDELETED>
                    <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
                    <ASORIGINAL>Yes</ASORIGINAL>
                    <ISCONDENSED>No</ISCONDENSED>
                    <AFFECTSSTOCK>No</AFFECTSSTOCK>
                    <ISRATEINCLUSIVEVAT>No</ISRATEINCLUSIVEVAT>
                    <FORPAYROLL>No</FORPAYROLL>
                    <ISABCENABLED>No</ISABCENABLED>
                    <ISCREDITDAYSCHKON>No</ISCREDITDAYSCHKON>
                    <INTERESTONBILLWISE>No</INTERESTONBILLWISE>
                    <OVERRIDEINTEREST>No</OVERRIDEINTEREST>
                    <OVERRIDEADVINTEREST>No</OVERRIDEADVINTEREST>
                    <USEFORVAT>No</USEFORVAT>
                    <IGNORETDSEXEMPT>No</IGNORETDSEXEMPT>
                    <ISTCSAPPLICABLE>No</ISTCSAPPLICABLE>
                    <ISTDSAPPLICABLE>No</ISTDSAPPLICABLE>
                    <ISFBTAPPLICABLE>No</ISFBTAPPLICABLE>
                    <ISGSTAPPLICABLE>No</ISGSTAPPLICABLE>
                    <ISEXCISEAPPLICABLE>No</ISEXCISEAPPLICABLE>
                    <ISTDSEXPENSE>No</ISTDSEXPENSE>
                    <ISEDLIAPPLICABLE>No</ISEDLIAPPLICABLE>
                    <ISRELATEDPARTY>No</ISRELATEDPARTY>
                    <USEFORESIELIGIBILITY>No</USEFORESIELIGIBILITY>
                    <ISINTERESTINCLLASTDAY>No</ISINTERESTINCLLASTDAY>
                    <APPROPRIATETAXVALUE>No</APPROPRIATETAXVALUE>
                    <ISBEHAVEASDUTY>No</ISBEHAVEASDUTY>
                    <INTERESTINCLDAYOFADDITION>No</INTERESTINCLDAYOFADDITION>
                    <INTERESTINCLDAYOFDEDUCTION>No</INTERESTINCLDAYOFDEDUCTION>
                    <ISOTHTERRITORYASSESSEE>No</ISOTHTERRITORYASSESSEE>
                    <IGNOREMISMATCHWITHWARNING>No</IGNOREMISMATCHWITHWARNING>
                    <USEASNOTIONALBANK>No</USEASNOTIONALBANK>
                    <OVERRIDECREDITLIMIT>No</OVERRIDECREDITLIMIT>
                    <ISAGAINSTFORMC>No</ISAGAINSTFORMC>
                    <ISCHEQUEPRINTINGENABLED>Yes</ISCHEQUEPRINTINGENABLED>
                    <ISPAYUPLOAD>No</ISPAYUPLOAD>
                    <ISPAYBATCHONLYSAL>No</ISPAYBATCHONLYSAL>
                    <ISBNFCODESUPPORTED>No</ISBNFCODESUPPORTED>
                    <ALLOWEXPORTWITHERRORS>No</ALLOWEXPORTWITHERRORS>
                    <CONSIDERPURCHASEFOREXPORT>No</CONSIDERPURCHASEFOREXPORT>
                    <ISTRANSPORTER>No</ISTRANSPORTER>
                    <USEFORNOTIONALITC>No</USEFORNOTIONALITC>
                    <ISECOMMOPERATOR>No</ISECOMMOPERATOR>
                    <OVERRIDEBASEDONREALIZATION>No</OVERRIDEBASEDONREALIZATION>
                    <SHOWINPAYSLIP>No</SHOWINPAYSLIP>
                    <USEFORGRATUITY>No</USEFORGRATUITY>
                    <ISTDSPROJECTED>No</ISTDSPROJECTED>
                    <FORSERVICETAX>No</FORSERVICETAX>
                    <ISINPUTCREDIT>No</ISINPUTCREDIT>
                    <ISEXEMPTED>No</ISEXEMPTED>
                    <ISABATEMENTAPPLICABLE>No</ISABATEMENTAPPLICABLE>
                    <ISSTXPARTY>No</ISSTXPARTY>
                    <ISSTXNONREALIZEDTYPE>No</ISSTXNONREALIZEDTYPE>
                    <ISUSEDFORCVD>No</ISUSEDFORCVD>
                    <LEDBELONGSTONONTAXABLE>No</LEDBELONGSTONONTAXABLE>
                    <ISEXCISEMERCHANTEXPORTER>No</ISEXCISEMERCHANTEXPORTER>
                    <ISPARTYEXEMPTED>No</ISPARTYEXEMPTED>
                    <ISSEZPARTY>No</ISSEZPARTY>
                    <TDSDEDUCTEEISSPECIALRATE>No</TDSDEDUCTEEISSPECIALRATE>
                    <ISECHEQUESUPPORTED>No</ISECHEQUESUPPORTED>
                    <ISEDDSUPPORTED>No</ISEDDSUPPORTED>
                    <HASECHEQUEDELIVERYMODE>No</HASECHEQUEDELIVERYMODE>
                    <HASECHEQUEDELIVERYTO>No</HASECHEQUEDELIVERYTO>
                    <HASECHEQUEPRINTLOCATION>No</HASECHEQUEPRINTLOCATION>
                    <HASECHEQUEPAYABLELOCATION>No</HASECHEQUEPAYABLELOCATION>
                    <HASECHEQUEBANKLOCATION>No</HASECHEQUEBANKLOCATION>
                    <HASEDDDELIVERYMODE>No</HASEDDDELIVERYMODE>
                    <HASEDDDELIVERYTO>No</HASEDDDELIVERYTO>
                    <HASEDDPRINTLOCATION>No</HASEDDPRINTLOCATION>
                    <HASEDDPAYABLELOCATION>No</HASEDDPAYABLELOCATION>
                    <HASEDDBANKLOCATION>No</HASEDDBANKLOCATION>
                    <ISEBANKINGENABLED>No</ISEBANKINGENABLED>
                    <ISEXPORTFILEENCRYPTED>No</ISEXPORTFILEENCRYPTED>
                    <ISBATCHENABLED>No</ISBATCHENABLED>
                    <ISPRODUCTCODEBASED>No</ISPRODUCTCODEBASED>
                    <HASEDDCITY>No</HASEDDCITY>
                    <HASECHEQUECITY>No</HASECHEQUECITY>
                    <ISFILENAMEFORMATSUPPORTED>No</ISFILENAMEFORMATSUPPORTED>
                    <HASCLIENTCODE>No</HASCLIENTCODE>
                    <PAYINSISBATCHAPPLICABLE>No</PAYINSISBATCHAPPLICABLE>
                    <PAYINSISFILENUMAPP>No</PAYINSISFILENUMAPP>
                    <ISSALARYTRANSGROUPEDFORBRS>No</ISSALARYTRANSGROUPEDFORBRS>
                    <ISEBANKINGSUPPORTED>No</ISEBANKINGSUPPORTED>
                    <ISSCBUAE>No</ISSCBUAE>
                    <ISBANKSTATUSAPP>No</ISBANKSTATUSAPP>
                    <ISSALARYGROUPED>No</ISSALARYGROUPED>
                    <USEFORPURCHASETAX>No</USEFORPURCHASETAX>
                    <AUDITED>No</AUDITED>
                    <SORTPOSITION> 1000</SORTPOSITION>
                    <ALTERID> 171</ALTERID>
                    <SERVICETAXDETAILS.LIST></SERVICETAXDETAILS.LIST>
                    <LBTREGNDETAILS.LIST></LBTREGNDETAILS.LIST>
                    <VATDETAILS.LIST></VATDETAILS.LIST>
                    <SALESTAXCESSDETAILS.LIST></SALESTAXCESSDETAILS.LIST>
                    <GSTDETAILS.LIST></GSTDETAILS.LIST>
                    <LANGUAGENAME.LIST>
                        <NAME.LIST TYPE="String">
                            <NAME>Suspense</NAME>
                        </NAME.LIST>
                        <LANGUAGEID> 1033</LANGUAGEID>
                    </LANGUAGENAME.LIST>
                    <XBRLDETAIL.LIST></XBRLDETAIL.LIST>
                    <AUDITDETAILS.LIST></AUDITDETAILS.LIST>
                    <SCHVIDETAILS.LIST></SCHVIDETAILS.LIST>
                    <EXCISETARIFFDETAILS.LIST></EXCISETARIFFDETAILS.LIST>
                    <TCSCATEGORYDETAILS.LIST></TCSCATEGORYDETAILS.LIST>
                    <TDSCATEGORYDETAILS.LIST></TDSCATEGORYDETAILS.LIST>
                    <SLABPERIOD.LIST></SLABPERIOD.LIST>
                    <GRATUITYPERIOD.LIST></GRATUITYPERIOD.LIST>
                    <ADDITIONALCOMPUTATIONS.LIST></ADDITIONALCOMPUTATIONS.LIST>
                    <EXCISEJURISDICTIONDETAILS.LIST></EXCISEJURISDICTIONDETAILS.LIST>
                    <EXCLUDEDTAXATIONS.LIST></EXCLUDEDTAXATIONS.LIST>
                    <BANKALLOCATIONS.LIST></BANKALLOCATIONS.LIST>
                    <PAYMENTDETAILS.LIST></PAYMENTDETAILS.LIST>
                    <BANKEXPORTFORMATS.LIST></BANKEXPORTFORMATS.LIST>
                    <BILLALLOCATIONS.LIST></BILLALLOCATIONS.LIST>
                    <INTERESTCOLLECTION.LIST></INTERESTCOLLECTION.LIST>
                    <LEDGERCLOSINGVALUES.LIST></LEDGERCLOSINGVALUES.LIST>
                    <LEDGERAUDITCLASS.LIST></LEDGERAUDITCLASS.LIST>
                    <OLDAUDITENTRIES.LIST></OLDAUDITENTRIES.LIST>
                    <TDSEXEMPTIONRULES.LIST></TDSEXEMPTIONRULES.LIST>
                    <DEDUCTINSAMEVCHRULES.LIST></DEDUCTINSAMEVCHRULES.LIST>
                    <LOWERDEDUCTION.LIST></LOWERDEDUCTION.LIST>
                    <STXABATEMENTDETAILS.LIST></STXABATEMENTDETAILS.LIST>
                    <LEDMULTIADDRESSLIST.LIST></LEDMULTIADDRESSLIST.LIST>
                    <STXTAXDETAILS.LIST></STXTAXDETAILS.LIST>
                    <CHEQUERANGE.LIST></CHEQUERANGE.LIST>
                    <DEFAULTVCHCHEQUEDETAILS.LIST></DEFAULTVCHCHEQUEDETAILS.LIST>
                    <ACCOUNTAUDITENTRIES.LIST></ACCOUNTAUDITENTRIES.LIST>
                    <AUDITENTRIES.LIST></AUDITENTRIES.LIST>
                    <BRSIMPORTEDINFO.LIST></BRSIMPORTEDINFO.LIST>
                    <AUTOBRSCONFIGS.LIST></AUTOBRSCONFIGS.LIST>
                    <BANKURENTRIES.LIST></BANKURENTRIES.LIST>
                    <DEFAULTCHEQUEDETAILS.LIST></DEFAULTCHEQUEDETAILS.LIST>
                    <DEFAULTOPENINGCHEQUEDETAILS.LIST></DEFAULTOPENINGCHEQUEDETAILS.LIST>
                    <CANCELLEDPAYALLOCATIONS.LIST></CANCELLEDPAYALLOCATIONS.LIST>
                    <ECHEQUEPRINTLOCATION.LIST></ECHEQUEPRINTLOCATION.LIST>
                    <ECHEQUEPAYABLELOCATION.LIST></ECHEQUEPAYABLELOCATION.LIST>
                    <EDDPRINTLOCATION.LIST></EDDPRINTLOCATION.LIST>
                    <EDDPAYABLELOCATION.LIST></EDDPAYABLELOCATION.LIST>
                    <AVAILABLETRANSACTIONTYPES.LIST></AVAILABLETRANSACTIONTYPES.LIST>
                    <LEDPAYINSCONFIGS.LIST></LEDPAYINSCONFIGS.LIST>
                    <TYPECODEDETAILS.LIST></TYPECODEDETAILS.LIST>
                    <FIELDVALIDATIONDETAILS.LIST></FIELDVALIDATIONDETAILS.LIST>
                    <INPUTCRALLOCS.LIST></INPUTCRALLOCS.LIST>
                    <TCSMETHODOFCALCULATION.LIST></TCSMETHODOFCALCULATION.LIST>
                    <GSTCLASSFNIGSTRATES.LIST></GSTCLASSFNIGSTRATES.LIST>
                    <EXTARIFFDUTYHEADDETAILS.LIST></EXTARIFFDUTYHEADDETAILS.LIST>
                    <VOUCHERTYPEPRODUCTCODES.LIST></VOUCHERTYPEPRODUCTCODES.LIST>
                </LEDGER>
            </TALLYMESSAGE>`;

  let vouchers = '';

  transactions.forEach(txn => {
    const date = formatDate(txn.date);
    const narration = escapeXml(txn.remarks || '');
    const absAmount = Math.abs(txn.amount).toFixed(1); // Format to 1 decimal place as seen in sample (e.g. 710.0) - actually usually Tally takes standard float. Sample has .0
    const type = txn.type; // 'DEBIT' or 'CREDIT'

    let voucherType = "Payment";
    let bankAmountVal, suspenseAmountVal;
    let bankIsDeemedPositive, suspenseIsDeemedPositive;
    
    // Logic derived from sample:
    // Payment: Suspense (Yes, -Amt), Bank (No, +Amt)
    // Receipt: Suspense (No, +Amt), Bank (Yes, -Amt)

    if (type === 'DEBIT') {
      voucherType = "Payment";
      
      // Suspense Entry
      suspenseIsDeemedPositive = "Yes";
      suspenseAmountVal = `-${absAmount}`; // Negative

      // Bank Entry
      bankIsDeemedPositive = "No";
      bankAmountVal = `${absAmount}`; // Positive

    } else { // CREDIT or Default
      voucherType = "Receipt";

      // Suspense Entry
      suspenseIsDeemedPositive = "No";
      suspenseAmountVal = `${absAmount}`; // Positive

      // Bank Entry
      bankIsDeemedPositive = "Yes";
      bankAmountVal = `-${absAmount}`; // Negative
    }

    vouchers += `
            <TALLYMESSAGE xmlns:UDF="TallyUDF">
                <VOUCHER VCHTYPE="${voucherType}" ACTION="Create" OBJVIEW="Accounting Voucher View">
                    <DATE>${date}</DATE>
                    <VOUCHERTYPENAME>${voucherType}</VOUCHERTYPENAME>
                    <NARRATION>${narration}</NARRATION>
                    <PARTYLEDGERNAME>${escapeXml(bankLedgerName)}</PARTYLEDGERNAME>
                    <CSTFORMISSUETYPE />
                    <CSTFORMRECVTYPE />
                    <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
                    <PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>
                    <VCHGSTCLASS />
                    <DIFFACTUALQTY>No</DIFFACTUALQTY>
                    <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
                    <ISDELETED>No</ISDELETED>
                    <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
                    <ASORIGINAL>No</ASORIGINAL>
                    <AUDITED>No</AUDITED>
                    <FORJOBCOSTING>No</FORJOBCOSTING>
                    <ISOPTIONAL>No</ISOPTIONAL>
                    <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
                    <USEFOREXCISE>No</USEFOREXCISE>
                    <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
                    <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
                    <USEFORINTEREST>No</USEFORINTEREST>
                    <USEFORGAINLOSS>No</USEFORGAINLOSS>
                    <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
                    <USEFORCOMPOUND>No</USEFORCOMPOUND>
                    <USEFORSERVICETAX>No</USEFORSERVICETAX>
                    <ISONHOLD>No</ISONHOLD>
                    <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
                    <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
                    <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
                    <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
                    <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
                    <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
                    <EXCISEOPENING>No</EXCISEOPENING>
                    <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
                    <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
                    <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
                    <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
                    <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
                    <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
                    <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
                    <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
                    <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
                    <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
                    <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
                    <ISISDVOUCHER>No</ISISDVOUCHER>
                    <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
                    <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
                    <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
                    <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
                    <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
                    <ISGSTREFUND>No</ISGSTREFUND>
                    <OVRDNEWAYBILLAPPLICABILITY>No</OVRDNEWAYBILLAPPLICABILITY>
                    <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
                    <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
                    <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
                    <IRNCANCELLED>No</IRNCANCELLED>
                    <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
                    <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
                    <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
                    <ISCANCELLED>No</ISCANCELLED>
                    <HASCASHFLOW>Yes</HASCASHFLOW>
                    <ISPOSTDATED>No</ISPOSTDATED>
                    <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
                    <ISINVOICE>No</ISINVOICE>
                    <MFGJOURNAL>No</MFGJOURNAL>
                    <HASDISCOUNTS>No</HASDISCOUNTS>
                    <ASPAYSLIP>No</ASPAYSLIP>
                    <ISCOSTCENTRE>No</ISCOSTCENTRE>
                    <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
                    <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
                    <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
                    <ISVOID>No</ISVOID>
                    <ORDERLINESTATUS>No</ORDERLINESTATUS>
                    <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
                    <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
                    <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
                    <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
                    <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
                    <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
                    <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
                    <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
                    <CHANGEVCHMODE>No</CHANGEVCHMODE>
                    <RESETIRNQRCODE>No</RESETIRNQRCODE>
                    <ALTERID> 4</ALTERID>
                    <MASTERID> 3</MASTERID>
                    <EWAYBILLDETAILS.LIST></EWAYBILLDETAILS.LIST>
                    <EXCLUDEDTAXATIONS.LIST></EXCLUDEDTAXATIONS.LIST>
                    <OLDAUDITENTRIES.LIST></OLDAUDITENTRIES.LIST>
                    <ACCOUNTAUDITENTRIES.LIST></ACCOUNTAUDITENTRIES.LIST>
                    <AUDITENTRIES.LIST></AUDITENTRIES.LIST>
                    <DUTYHEADDETAILS.LIST></DUTYHEADDETAILS.LIST>
                    <SUPPLEMENTARYDUTYHEADDETAILS.LIST></SUPPLEMENTARYDUTYHEADDETAILS.LIST>
                    <EWAYBILLERRORLIST.LIST></EWAYBILLERRORLIST.LIST>
                    <IRNERRORLIST.LIST></IRNERRORLIST.LIST>
                    <INVOICEDELNOTES.LIST></INVOICEDELNOTES.LIST>
                    <INVOICEORDERLIST.LIST></INVOICEORDERLIST.LIST>
                    <INVOICEINDENTLIST.LIST></INVOICEINDENTLIST.LIST>
                    <ATTENDANCEENTRIES.LIST></ATTENDANCEENTRIES.LIST>
                    <ORIGINVOICEDETAILS.LIST></ORIGINVOICEDETAILS.LIST>
                    <INVOICEEXPORTLIST.LIST></INVOICEEXPORTLIST.LIST>
                    <ALLLEDGERENTRIES.LIST>
                        <LEDGERNAME>Suspense</LEDGERNAME>
                        <GSTCLASS />
                        <ISDEEMEDPOSITIVE>${suspenseIsDeemedPositive}</ISDEEMEDPOSITIVE>
                        <LEDGERFROMITEM>No</LEDGERFROMITEM>
                        <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
                        <ISPARTYLEDGER>No</ISPARTYLEDGER>
                        <ISLASTDEEMEDPOSITIVE>${suspenseIsDeemedPositive}</ISLASTDEEMEDPOSITIVE>
                        <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
                        <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
                        <AMOUNT>${suspenseAmountVal}</AMOUNT>
                        <SERVICETAXDETAILS.LIST></SERVICETAXDETAILS.LIST>
                        <BANKALLOCATIONS.LIST></BANKALLOCATIONS.LIST>
                        <BILLALLOCATIONS.LIST></BILLALLOCATIONS.LIST>
                        <INTERESTCOLLECTION.LIST></INTERESTCOLLECTION.LIST>
                        <OLDAUDITENTRIES.LIST></OLDAUDITENTRIES.LIST>
                        <ACCOUNTAUDITENTRIES.LIST></ACCOUNTAUDITENTRIES.LIST>
                        <AUDITENTRIES.LIST></AUDITENTRIES.LIST>
                        <INPUTCRALLOCS.LIST></INPUTCRALLOCS.LIST>
                        <DUTYHEADDETAILS.LIST></DUTYHEADDETAILS.LIST>
                        <EXCISEDUTYHEADDETAILS.LIST></EXCISEDUTYHEADDETAILS.LIST>
                        <RATEDETAILS.LIST></RATEDETAILS.LIST>
                        <SUMMARYALLOCS.LIST></SUMMARYALLOCS.LIST>
                        <STPYMTDETAILS.LIST></STPYMTDETAILS.LIST>
                        <EXCISEPAYMENTALLOCATIONS.LIST></EXCISEPAYMENTALLOCATIONS.LIST>
                        <TAXBILLALLOCATIONS.LIST></TAXBILLALLOCATIONS.LIST>
                        <TAXOBJECTALLOCATIONS.LIST></TAXOBJECTALLOCATIONS.LIST>
                        <TDSEXPENSEALLOCATIONS.LIST></TDSEXPENSEALLOCATIONS.LIST>
                        <VATSTATUTORYDETAILS.LIST></VATSTATUTORYDETAILS.LIST>
                        <COSTTRACKALLOCATIONS.LIST></COSTTRACKALLOCATIONS.LIST>
                        <REFVOUCHERDETAILS.LIST></REFVOUCHERDETAILS.LIST>
                        <INVOICEWISEDETAILS.LIST></INVOICEWISEDETAILS.LIST>
                        <VATITCDETAILS.LIST></VATITCDETAILS.LIST>
                        <ADVANCETAXDETAILS.LIST></ADVANCETAXDETAILS.LIST>
                    </ALLLEDGERENTRIES.LIST>
                    <ALLLEDGERENTRIES.LIST>
                        <LEDGERNAME>${escapeXml(bankLedgerName)}</LEDGERNAME>
                        <GSTCLASS />
                        <ISDEEMEDPOSITIVE>${bankIsDeemedPositive}</ISDEEMEDPOSITIVE>
                        <LEDGERFROMITEM>No</LEDGERFROMITEM>
                        <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
                        <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
                        <ISLASTDEEMEDPOSITIVE>${bankIsDeemedPositive}</ISLASTDEEMEDPOSITIVE>
                        <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
                        <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
                        <AMOUNT>${bankAmountVal}</AMOUNT>
                        <SERVICETAXDETAILS.LIST></SERVICETAXDETAILS.LIST>
                        <BANKALLOCATIONS.LIST>
                            <DATE>${date}</DATE>
                            <INSTRUMENTDATE>${date}</INSTRUMENTDATE>
                            <TRANSACTIONTYPE>Cheque</TRANSACTIONTYPE>
                            <PAYMENTFAVOURING>Suspense</PAYMENTFAVOURING>
                            <STATUS>No</STATUS>
                            <PAYMENTMODE>Transacted</PAYMENTMODE>
                            <BANKPARTYNAME>Suspense</BANKPARTYNAME>
                            <ISCONNECTEDPAYMENT>No</ISCONNECTEDPAYMENT>
                            <ISSPLIT>No</ISSPLIT>
                            <ISCONTRACTUSED>No</ISCONTRACTUSED>
                            <ISACCEPTEDWITHWARNING>No</ISACCEPTEDWITHWARNING>
                            <ISTRANSFORCED>No</ISTRANSFORCED>
                            <AMOUNT>${bankAmountVal}</AMOUNT>
                            <CONTRACTDETAILS.LIST></CONTRACTDETAILS.LIST>
                            <BANKSTATUSINFO.LIST></BANKSTATUSINFO.LIST>
                        </BANKALLOCATIONS.LIST>
                        <BILLALLOCATIONS.LIST></BILLALLOCATIONS.LIST>
                        <INTERESTCOLLECTION.LIST></INTERESTCOLLECTION.LIST>
                        <OLDAUDITENTRIES.LIST></OLDAUDITENTRIES.LIST>
                        <ACCOUNTAUDITENTRIES.LIST></ACCOUNTAUDITENTRIES.LIST>
                        <AUDITENTRIES.LIST></AUDITENTRIES.LIST>
                        <INPUTCRALLOCS.LIST></INPUTCRALLOCS.LIST>
                        <DUTYHEADDETAILS.LIST></DUTYHEADDETAILS.LIST>
                        <EXCISEDUTYHEADDETAILS.LIST></EXCISEDUTYHEADDETAILS.LIST>
                        <RATEDETAILS.LIST></RATEDETAILS.LIST>
                        <SUMMARYALLOCS.LIST></SUMMARYALLOCS.LIST>
                        <STPYMTDETAILS.LIST></STPYMTDETAILS.LIST>
                        <EXCISEPAYMENTALLOCATIONS.LIST></EXCISEPAYMENTALLOCATIONS.LIST>
                        <TAXBILLALLOCATIONS.LIST></TAXBILLALLOCATIONS.LIST>
                        <TAXOBJECTALLOCATIONS.LIST></TAXOBJECTALLOCATIONS.LIST>
                        <TDSEXPENSEALLOCATIONS.LIST></TDSEXPENSEALLOCATIONS.LIST>
                        <VATSTATUTORYDETAILS.LIST></VATSTATUTORYDETAILS.LIST>
                        <COSTTRACKALLOCATIONS.LIST></COSTTRACKALLOCATIONS.LIST>
                        <REFVOUCHERDETAILS.LIST></REFVOUCHERDETAILS.LIST>
                        <INVOICEWISEDETAILS.LIST></INVOICEWISEDETAILS.LIST>
                        <VATITCDETAILS.LIST></VATITCDETAILS.LIST>
                        <ADVANCETAXDETAILS.LIST></ADVANCETAXDETAILS.LIST>
                    </ALLLEDGERENTRIES.LIST>
                    <PAYROLLMODEOFPAYMENT.LIST></PAYROLLMODEOFPAYMENT.LIST>
                    <ATTDRECORDS.LIST></ATTDRECORDS.LIST>
                    <GSTEWAYCONSIGNORADDRESS.LIST></GSTEWAYCONSIGNORADDRESS.LIST>
                    <GSTEWAYCONSIGNEEADDRESS.LIST></GSTEWAYCONSIGNEEADDRESS.LIST>
                    <TEMPGSTRATEDETAILS.LIST></TEMPGSTRATEDETAILS.LIST>
                </VOUCHER>
            </TALLYMESSAGE>`;
  });

  const finalXml = `
<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Import Data</TALLYREQUEST>
    </HEADER>

    <BODY>
        <IMPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>All Masters</REPORTNAME>
                <STATICVARIABLES>
            </STATICVARIABLES>
        </REQUESTDESC>
        <REQUESTDATA>
${SUSPENSE_LEDGER_DEF}
${vouchers}
        </REQUESTDATA>
        </IMPORTDATA>
    </BODY>
</ENVELOPE>
`;

  return finalXml.trim();
};
