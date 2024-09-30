import React from 'react';
import * as XLSX from 'xlsx/xlsx';
import XlsxPopulate, * as xlsxPopulate from 'xlsx-populate/browser/xlsx-populate';


export const ExcelExportDealers = ({data, whitelistProducts}) => {
    //console.log("valuesToFilter no excel", usersDealerInfo)


    const createDownloadData = () => {
        const year = 2024;
        handleExport().then((url) => {
            //console.log(url)
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', url);
            downloadAnchorNode.setAttribute('download', 'RELATORIO DE Lineup Geral '+'.xlsx');
            downloadAnchorNode.click()
            downloadAnchorNode.remove()
        });
    }

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);

        const view = new Uint8Array(buf);

        for(let i = 0 ; i !== s.length; i++) {
            view[i] = s.charCodeAt(i)
        }

        return buf;
    }

    const workbook2blob = (workbook) => {

        const wopts = {
            bookType: 'xlsx',
            type: 'binary',

        }

        const wbout = XLSX.write(workbook, wopts);

        const blob = new Blob([s2ab(wbout)], {
            type: 'application/octet-stream'
        });

        return blob;
    };

    const handleExport = () => {
        {/*
        const title =[{A: 'OPERADORA: YOU CAST COMERCIO DE EQUIPAMENTOS ELETRONICOS LTDA'}]; 
    
    
        let table1 =[
            {
                A: 'COMPÊTENCIA',
                B: 0
            },
            {
                A: 'NUMERO DE ASSINANTES',
                B: 0
            },
            {
                A: 'VALOR UNITARIO POR ASSINANTES',
                B: "R$ " + 0
            },
            {
                A: 'MÍNIMO GARANTIDO',
                B: 'R$ 0,00'
            },
            {
                A: 'VALOR EM REAIS TOTAL A SER FATURADO (MG)',
                B: 0
            }
        ];
    */}
        const title2 =[{A: 'Relatório - Lineup Geral'}]; 
        //console.log("aqui temos o assinant", assinant.find(item => item.totalSubscribers))
        //console.log("aqui temos o assinant", assinant.slice(item => item.totalSubscribers))
        //const assinantes = assinant.map(item => item.totalSubscribers).toString();
        //const periodo = assinant.map(item => item.period).toString();
        //const faturado = fatured.map(item => item.fatured).toString()
        //const base = fatured.map(item => item.baseValue).toString()
        //console.log("o res é ", assinantes.toString())


        let table2 =[
            {
                A: 'Provedor (nome fantasia)',
                B: 'Razão social',
                C: 'Categoria',
                D: 'CNPJ',
                E: 'Cidade/Estado',
                F: 'Status Integração',
                G: 'Pacotes Ativos',
            }
        ];


        data.forEach(( row, idx) => {
            //console.log("o valor de data no excel", data)
            const evolutionDetails = row;


            table2.push({
                A: row.dealers_fantasy_name,
                B: row.dealers_company_name,
                C: row.dealers_category,
                D: row.dealers_cnpj,
                E: row.dealers_city + "/" + row.dealers_state,
                F: row.dealers_active === 1 ? "Ativo" : "Inativo",
                G: whitelistProducts.filter(whitelist => whitelist.products_dealers_dealers_id === row.dealers_id).map(e => e).length,
                
            });
            //console.log("tabela", table1)

        });
        
        {/*
    
        const finalData = [...title, ...table1]
    
        const sheet = XLSX.utils.json_to_sheet(finalData, {
            skipHeader: true,
        
            XLSX.utils.book_append_sheet(wb, sheet, 'Operadora');
        });
        var headerIndexes = [];
        finalData.forEach((data, index) =>
          data["A"] === "OPERADORA: YOU CAST COMERCIO DE EQUIPAMENTOS ELETRONICOS LTDA" ? headerIndexes.push(index) : null
        );
    */}
        const finalData2 = [...title2, ...table2]
        
        const wb = XLSX.utils.book_new();

        const sheet2 = XLSX.utils.json_to_sheet(finalData2, {
            skipHeader: true,
        
        });

        XLSX.utils.book_append_sheet(wb, sheet2, 'Provedores');

        const workbookBlob = workbook2blob(wb);


        var headerIndexes2 = [];
        finalData2.forEach((data, index) =>
          data["A"] === "Relatório - Evolução de Ativos STENNA" ? headerIndexes2.push(index) : null
        );
    
        const totalRecords = data.length;


        const dataInfo2 = {
            titleCell: 'A1',
            titleRange: 'A1:G1',
            tbodyRange: `A3:G${finalData2.length}`,
            theadRangeC: `G2:G${finalData2.length}`,
            theadRange: 
                headerIndexes2?.length >= 1
                ? `A${headerIndexes2[0] + 1}:C${headerIndexes2[0] + 1}`
                : null,
            tFirstColumnRange:
                headerIndexes2?.length >= 1
                ? `A${headerIndexes2[0] + 1}:A${totalRecords + headerIndexes2[0] + 1}`
                : null,
            tLastColumnRange:
                headerIndexes2?.length >= 1
                ? `H${headerIndexes2[0] + 1}:D${totalRecords + headerIndexes2[0] + 1}`
                : null,
        };

        return addStyles(workbookBlob, dataInfo2);
            

    };

    const addStyles = (workbookBlob, dataInfo2) => {
        return XlsxPopulate.fromDataAsync(workbookBlob).then(workbook => {
            //console.log("aqui está meu workbook", workbook)
            //console.log("aqui está meu workbook sheet", workbook.sheet(0).cell("A1"))

            //Planilha 1 estilos e etc
            workbook.sheet(0).range('A1:B1').merged(true).style({
                bold: true,
                underline: true,
                fill: 'fff600',
                horizontalAlignment: "center",
                verticalAlignment: "center",
            });
            workbook.sheet(0).range("A1:B6").style({
                horizontalAlignment: "center",
                verticalAlignment: "center",
                borderStyle: 'solid',
                border: true,
                fontFamily: 'Times New Roman'
            });

            //Planilha 1 tamanhos e etc
            {/*
            workbook.sheet(0).column("A").width(45);
            workbook.sheet(0).column("B").width(35);
            workbook.sheet(0).row(1).height(25);
        
        
        */}



            //Planilha2
            workbook.sheet(0).range('A1:E1').value('');
            workbook.sheet(0).range('A2:E2').style({
                bold: true,
                underline: true,
                horizontalAlignment: "center",
                verticalAlignment: "center",
                borderStyle: 'solid 20',
                border: true,
                fontFamily: 'Times New Roman'
            });
            workbook.sheet(0).range(dataInfo2.tbodyRange).style({
                borderStyle: 'solid',
                border: true,
                fontFamily: 'Times New Roman'
            });

            workbook.sheet(0).column("C").style({
                horizontalAlignment: "center",
                verticalAlignment: "center",
            })
            workbook.sheet(0).column("E").style({
                horizontalAlignment: "center",
                verticalAlignment: "center",
            })

            //Planilha 2 tamanhos e etc
            workbook.sheet(0).column("A").width(30);
            workbook.sheet(0).column("B").width(50);
            workbook.sheet(0).column("C").width(25);
            workbook.sheet(0).column("D").width(30);
            workbook.sheet(0).column("E").width(30);
            workbook.sheet(0).row(2).height(25);
            workbook.sheet(0).row(1).height(0);

            return workbook.outputAsync().then(workbookBlob => URL.createObjectURL(workbookBlob));
        })
    }


    return <p onClick={() => createDownloadData()} className='menuAction' >Export to XLSX</p>

}



export const ExcelExportAtivosTotalMedia = ({data, month, assinant, fatured, usersDealerInfo}) => {
    //console.log("valuesToFilter no excel", usersDealerInfo)


    const createDownloadData = () => {
        const year = 2024;
        handleExport().then((url) => {
            //console.log(url)
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', url);
            downloadAnchorNode.setAttribute('download', 'RELATORIO DE ASSINANTES - Total Media - Ref. '+'.xlsx');
            downloadAnchorNode.click()
            downloadAnchorNode.remove()
        });
    }

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);

        const view = new Uint8Array(buf);

        for(let i = 0 ; i !== s.length; i++) {
            view[i] = s.charCodeAt(i)
        }

        return buf;
    }

    const workbook2blob = (workbook) => {

        const wopts = {
            bookType: 'xlsx',
            type: 'binary',

        }

        const wbout = XLSX.write(workbook, wopts);

        const blob = new Blob([s2ab(wbout)], {
            type: 'application/octet-stream'
        });

        return blob;
    };

    const handleExport = () => {
        {/*
        const title =[{A: 'OPERADORA: YOU CAST COMERCIO DE EQUIPAMENTOS ELETRONICOS LTDA'}]; 
    
    
        let table1 =[
            {
                A: 'COMPÊTENCIA',
                B: 0
            },
            {
                A: 'NUMERO DE ASSINANTES',
                B: 0
            },
            {
                A: 'VALOR UNITARIO POR ASSINANTES',
                B: "R$ " + 0
            },
            {
                A: 'MÍNIMO GARANTIDO',
                B: 'R$ 0,00'
            },
            {
                A: 'VALOR EM REAIS TOTAL A SER FATURADO (MG)',
                B: 0
            }
        ];
    */}
        const title2 =[{A: 'Relatório - Evolução de Ativos Total Media'}]; 
        //console.log("aqui temos o assinant", assinant.find(item => item.totalSubscribers))
        //console.log("aqui temos o assinant", assinant.slice(item => item.totalSubscribers))
        //const assinantes = assinant.map(item => item.totalSubscribers).toString();
        //const periodo = assinant.map(item => item.period).toString();
        //const faturado = fatured.map(item => item.fatured).toString()
        //const base = fatured.map(item => item.baseValue).toString()
        //console.log("o res é ", assinantes.toString())


        let table2 =[
            {
                A: 'Provedor (nome fantasia)',
                B: 'Razão social',
                C: 'CNPJ',
                D: 'Cidade/Estado',
                E: 'Número de assinantes',
            }
        ];


        data.forEach(( row, idx) => {
            //console.log("o valor de data no excel", data)
            const evolutionDetails = row;
            
            const detailEvolution = usersDealerInfo.filter(dados => evolutionDetails.dealers_name.includes(dados.dealer)).map((row, index) => {
                //console.log("o valor de row dentro do detailevolution", row)
                let teste = {
                  dealer: row.dealer,
                  customer: row.customers.map((customers) => {
                    //console.log("o customers", customers)
                    //console.log("o customers", customers.customers.map(e => e.packages.filter(row => row.haveTotalMedia === 1).map(row => row.haveTotalMedia) ))
                    let teste2 = {
                      login: customers.login,
                      haveTotalMedia: customers.packages.filter(row => row.haveTotalMedia === 1).map(row => row.haveTotalMedia)
                    }
                    //console.log("meu teste2", teste2)
                    return teste2
                  } ) 
                }
                return teste;
            })
            const finalEvolution = detailEvolution.map((row, index) => {
                //console.log("o que tem no detail", row)
  
                let firstValidation = {
                  dealer: row.dealer,
                  customer: row.customer.map((row) => {  
                    //console.log("meu row", row.map(e => e.haveTotalMedia))
                    let secondValidation = {
                      login: row.login,
                      sucessCountTotalMedia: row.haveTotalMedia.length > 0 ? 1 : 0
                    }
                    return secondValidation
                  })
                }
                return firstValidation
              })


              const totalInfoUsers = finalEvolution.map((row, index) => {
                //console.log("vejamos", row.customer.map(row => row.sucessCountTotalMedia.length))
                let totalDealerUsers = {
                  dealer: row.dealer,
                  validatedCustomers: row.customer.filter(row => row.sucessCountTotalMedia > 0).map(row => {
                      let data = {
                        login: row.login,
                        pacote: row.sucessCountTotalMedia > 0 ? "Pacote Total Media" : ''

                      }
                      return data
                    
                    }),
                  totalCustomersTotalMedia: row.customer.map(row => row.sucessCountTotalMedia).reduce((accumulator,value) => accumulator + value,0),
                }
                return totalDealerUsers
              })


            table2.push({
                A: row.dealers_fantasy_name,
                B: row.dealers_company_name,
                C: row.dealers_cnpj,
                D: row.dealers_city + "/" + row.dealers_state,
                E: totalInfoUsers.map(row => row.totalCustomersTotalMedia)[0],
                
            });
            //console.log("tabela", table1)

        });
        
        {/*
    
        const finalData = [...title, ...table1]
    
        const sheet = XLSX.utils.json_to_sheet(finalData, {
            skipHeader: true,
        
            XLSX.utils.book_append_sheet(wb, sheet, 'Operadora');
        });
        var headerIndexes = [];
        finalData.forEach((data, index) =>
          data["A"] === "OPERADORA: YOU CAST COMERCIO DE EQUIPAMENTOS ELETRONICOS LTDA" ? headerIndexes.push(index) : null
        );
    */}
        const finalData2 = [...title2, ...table2]
        
        const wb = XLSX.utils.book_new();

        const sheet2 = XLSX.utils.json_to_sheet(finalData2, {
            skipHeader: true,
        
        });

        XLSX.utils.book_append_sheet(wb, sheet2, 'Provedores');

        const workbookBlob = workbook2blob(wb);


        var headerIndexes2 = [];
        finalData2.forEach((data, index) =>
          data["A"] === "Relatório - Evolução de Ativos STENNA" ? headerIndexes2.push(index) : null
        );
    
        const totalRecords = data.length;


        const dataInfo2 = {
            titleCell: 'A1',
            titleRange: 'A1:E1',
            tbodyRange: `A3:E${finalData2.length}`,
            theadRangeC: `E2:E${finalData2.length}`,
            theadRange: 
                headerIndexes2?.length >= 1
                ? `A${headerIndexes2[0] + 1}:C${headerIndexes2[0] + 1}`
                : null,
            tFirstColumnRange:
                headerIndexes2?.length >= 1
                ? `A${headerIndexes2[0] + 1}:A${totalRecords + headerIndexes2[0] + 1}`
                : null,
            tLastColumnRange:
                headerIndexes2?.length >= 1
                ? `H${headerIndexes2[0] + 1}:D${totalRecords + headerIndexes2[0] + 1}`
                : null,
        };

        return addStyles(workbookBlob, dataInfo2);
            

    };

    const addStyles = (workbookBlob, dataInfo2) => {
        return XlsxPopulate.fromDataAsync(workbookBlob).then(workbook => {
            //console.log("aqui está meu workbook", workbook)
            //console.log("aqui está meu workbook sheet", workbook.sheet(0).cell("A1"))

            //Planilha 1 estilos e etc
            workbook.sheet(0).range('A1:B1').merged(true).style({
                bold: true,
                underline: true,
                fill: 'fff600',
                horizontalAlignment: "center",
                verticalAlignment: "center",
            });
            workbook.sheet(0).range("A1:B6").style({
                horizontalAlignment: "center",
                verticalAlignment: "center",
                borderStyle: 'solid',
                border: true,
                fontFamily: 'Times New Roman'
            });

            //Planilha 1 tamanhos e etc
            {/*
            workbook.sheet(0).column("A").width(45);
            workbook.sheet(0).column("B").width(35);
            workbook.sheet(0).row(1).height(25);
        
        
        */}



            //Planilha2
            workbook.sheet(0).range('A1:E1').value('');
            workbook.sheet(0).range('A2:E2').style({
                bold: true,
                underline: true,
                horizontalAlignment: "center",
                verticalAlignment: "center",
                borderStyle: 'solid 20',
                border: true,
                fontFamily: 'Times New Roman'
            });
            workbook.sheet(0).range(dataInfo2.tbodyRange).style({
                borderStyle: 'solid',
                border: true,
                fontFamily: 'Times New Roman'
            });

            workbook.sheet(0).column("C").style({
                horizontalAlignment: "center",
                verticalAlignment: "center",
            })
            workbook.sheet(0).column("E").style({
                horizontalAlignment: "center",
                verticalAlignment: "center",
            })

            //Planilha 2 tamanhos e etc
            workbook.sheet(0).column("A").width(30);
            workbook.sheet(0).column("B").width(50);
            workbook.sheet(0).column("C").width(25);
            workbook.sheet(0).column("D").width(30);
            workbook.sheet(0).column("E").width(30);
            workbook.sheet(0).row(2).height(25);
            workbook.sheet(0).row(1).height(0);

            return workbook.outputAsync().then(workbookBlob => URL.createObjectURL(workbookBlob));
        })
    }


    return <p onClick={() => createDownloadData()} className='menuAction' >Export to XLSX</p>

}