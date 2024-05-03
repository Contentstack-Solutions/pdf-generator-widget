import { useState } from 'react';
import axios from 'axios'
import { Button, Dropdown, Icon, Select } from '@contentstack/venus-components';
import htmlToPdfmake from 'html-to-pdfmake'
import './pdfWidget.css'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let docDefinition: any = {content:[]}

const PdfWidget = (props: any) => {
    const [pdfUrl, setPdfUrl] = useState('')
    const [value, setValue] = useState([])
    const [loading, setLoading] = useState(false)

    const getPdf = async (fileName: string, folderUid: string) => {
        try {
            let config: any = {
                method: 'get',
                url: `https://api.contentstack.io/v3/assets?folder=${folderUid}`,
                headers: {
                    'api_key': 'bltafc77b6da64d7b0c',
                    'authorization': 'cs54893cf38a5192d76df3723b',
                    'Content-Type': 'application/json'
                }
            };

            let response = await axios(config)
            let pdf: any = response.data.assets.filter((asset: any) => {
                return asset.title === fileName
            })
            if (pdf?.length > 0) {
                return { isAssetPresent: true, assets: pdf[0] }
            } else return { isAssetPresent: false }
        } catch (error) {
            console.log('error', error);
            return { isAssetPresent: false }
        }
    };

    const createFolder = async (folderName: any) => {
        try {
            let raw = JSON.stringify({
                "asset": {
                    "name": folderName
                }
            });
            let requestOptions: any = {
                method: 'POST',
                headers: {
                    'authorization': 'cs54893cf38a5192d76df3723b',
                    'api_key': 'bltafc77b6da64d7b0c',
                    'Content-Type': 'application/json'
                },
                body: raw,
                redirect: 'follow'
            };
            return fetch("https://api.contentstack.io/v3/assets/folders", requestOptions)
        } catch (error) {
            console.log("error is", error);
        }
    }

    const getFolder = async (folderName: any) => {
        try {
            var requestOptions: any = {
                method: 'GET',
                headers: {
                    authorization: 'cs54893cf38a5192d76df3723b',
                    api_key: 'bltafc77b6da64d7b0c'
                },
                redirect: 'follow'
            };
            var query = JSON.stringify({
                "is_dir": true,
                "name": folderName
            })
            return fetch(`https://api.contentstack.io/v3/assets?query=${query}`, requestOptions)
        } catch (error) {
            console.log("error is", error);
        }
    }

    const uploadPdf = async (formData: any, folderUid: any) => {
        try {
            formData.append('asset[parent_uid]', folderUid) //Adds folder uid to which upload should happen
            fetch('https://api.contentstack.io/v3/assets', {
                method: 'POST',
                headers: {
                    authorization: 'cs54893cf38a5192d76df3723b',
                    api_key: 'bltafc77b6da64d7b0c'
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    setPdfUrl(data.asset.url)
                    setLoading(false)
                });
        } catch (error) {
            console.log("error is", error);
        }
    }

    const updatePdf = async (formData: any, fileName: string, folderName: any) => {
        try {
            fetch(`https://api.contentstack.io/v3/assets/${fileName}`, {
                method: 'PUT',
                headers: {
                    authorization: 'cs54893cf38a5192d76df3723b',
                    api_key: 'bltafc77b6da64d7b0c'
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    setPdfUrl(data.asset.url)
                    setLoading(false)
                });
        } catch (error) {
            console.log("error is", error);
        }
    }

    const convertImg = async (imgUrl: any) => {
        try {
            if(imgUrl && imgUrl != null){
                let res = await axios.get(imgUrl, { responseType: 'arraybuffer' })
                const base64 = btoa(
                    new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                let image = `data:image/jpeg;base64,${base64}`
                return image
            }
            else{
                return null
            }
            
          
        }
        catch (err) {
            console.log("err", err)
        }
    }

    const handlePdfTemplate = async (orderArray: any) => {
        //console.log(props.entryData)
        setPdfUrl('')
        docDefinition.content = []
        for (const element of orderArray) {
            switch(element){
                case 'Title': {
                    docDefinition.content.push({
                        text: props.entryData.title,
                        bold: true,
                        fontSize: 20,
                        marginBottom: 20,
                        decoration: 'underline'
                    })
                    break;

                }
                case 'Summary': {
                    var summary = props.entryData.summary;
                    var lengthChar = summary.length;
                    var halfLen = lengthChar / 2;
                    var char_summary = summary.substring(0, halfLen);
                    var after = summary.substring(halfLen, summary.length);
                    var summary_col = {};
                    if (lengthChar <= 100) {
                        summary_col = {
                            text: summary,
                            fontSize: 16,
                        };
                    } else {
                        summary_col = {
                            alignment: "justify",
                            columnGap: 20,
                            columns: [
                                {
                                    text: char_summary,
                                },
                                {
                                    text: after,
                                },
                            ],
                        };
                    }
                    docDefinition.content.push(
                        summary_col
                    )
                    break

                }
                case 'Banner': {
                    let bannerImage = await convertImg(props.entryData?.featured_image?.url ? props.entryData?.featured_image?.url:null)
                    if(bannerImage && bannerImage != null){
                        docDefinition.content.push({
                            image: bannerImage,
                            pageBreak: "after",
                            removeExtraBlanks:true,
                            alignment: 'center',
                            marginTop: 30,
    
                        })
                    }
                   
                    break;
                }
                case 'Product Listing':{
                    let productArray = props.entryData.products_listing
                        for (const val of productArray) {
                        switch(Object.keys(val)[0]) {
                           case 'reference_product': {
                            let referenceImg = await convertImg(val?.reference_product?.product[0]?.product_image?.url ? val?.reference_product?.product[0]?.product_image?.url:null)
                           var referenceColumns = []
                           if(referenceImg && referenceImg != null){
                            referenceColumns.push( {
                                width:150,
                                height: 100,                                           
                                image: referenceImg,
                            },
                            {   
                                text: val.reference_product.product[0].product_description_
                            });

                           }
                           else{
                            referenceColumns.push({   
                                text: val.reference_product.product[0].product_description_
                            })
                           }
                           
                            docDefinition.content.push(
                                {
                                    text: val.reference_product.product[0].title,
                                    bold: true,
                                    fontSize: 20,
                                    marginTop: 20,
                                    decoration: 'underline'
                         
                                },
                                " ",
                                {
                                    columnGap: 20, 
                                    marginBottom: 20,
                                    columns: referenceColumns
                                },
                                " ",
                                htmlToPdfmake(val.reference_product.product[0].technical_specifications_))
                            break;
                           } 
                           case 'inline_product': {
                            let inlineImage: any = await convertImg(val.inline_product?.product_image?.url ? val.inline_product?.product_image?.url :null)
                            var inlineColumns = []
                            if(inlineImage && inlineImage != null){
                                inlineColumns.push({
                                    width:130,  
                                    height: 100,                                           
                                    image: inlineImage,
                                },
                                {   
                                    text: val.inline_product.product_description_
                                });
                            }
                            else{
                                inlineColumns.push( {   
                                    text: val.inline_product.product_description_
                                })
                            }
                                docDefinition.content.push(
                                    {
                                        text: val.inline_product.product_title,
                                        bold: true,
                                        fontSize: 20,
                                        marginTop: 20, 
                                        decoration: 'underline'
                                    },
                                    " ",
                                    {
                                        columnGap: 20, 
                                        marginBottom: 20,
                                        columns: inlineColumns
                                    },
                                    " ",
                                    htmlToPdfmake(val.inline_product.technical_specification))
                            
                          
                            break;
                           } 
                        }
                    }
                    break;
                }
            }
        }
        generatePdf()
    }

    const generatePdf = async () => {
        pdfMake.createPdf(docDefinition).getBlob(async function (pdfBlob: any) {
            let folderName = props.entryData.title.replace(/[^a-zA-Z0-9_-\s]+/g, '');
            let fileName = `${props.entryData.uid}.pdf`
            let formData = new FormData();
            formData.append('asset[upload]', pdfBlob, fileName);
            let data: any = await getFolder(folderName)
            const result: any = await data.json()
            if (result.assets.length > 0) {
                let response: any = await getPdf(fileName, result.assets[0].uid);
                if (response.isAssetPresent) {
                    await updatePdf(formData, response.assets.uid, folderName)
                } else {
                    await uploadPdf(formData, result.assets[0].uid)
                }
            } else {
                let newFolder: any = await createFolder(folderName)
                const result: any = await newFolder.json()
                await uploadPdf(formData, result.asset.uid)
            }
        });
    }

    const downloadPDF = async () => {
        pdfMake.createPdf(docDefinition).download();
    }

    const getOptions = () => {
        return [
            {
                label: 'Title',
                value: 'title',
                title: true
            },
            {
                label: 'Summary',
                value: 'summary',
                summary: true
            },
            {
                label: 'Banner',
                value: 'banner',
                image: true
            },
            {
                label: 'Product Listing',
                value: 'product_listing',
                table: true
            }
        ]
    }

    const createList = (value: any) => {
        return value.map((item: any, index: number) => {
            return {
                canDragDrop: true,
                id: `test${index}`,
                label: <><div className='dragLable'>{item.label}</div></>
            }
        })
    }

    let list: any = createList(value)

    const updateValue = (data: any) => {
        setValue(data)
        setListData(createList(data))
        setPdfUrl('')
    }

    const [listData, setListData] = useState(list)

    const reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return result
    }

    const onDragEnd = (result: any, draggableId: any) => {
        if (!result.destination) {
            return
        }
        const updatedList: any = reorder(listData, result.source.index, result.destination.index)
        setListData(updatedList)
    }

    const handlePdfOrdering = () => {
        let templateOrder = listData.map((item: any) => {return item.label.props.children.props.children})
        handlePdfTemplate(templateOrder)
        setLoading(true);
    }

    return (
        <div>
            <Select
                selectLabel="Select Required Fields"
                value={value}
                isMulti={true}
                onChange={updateValue}
                options={getOptions()}
                placeholder="Select Fields"
                isSearchable={true}
                isClearable={true}
                width="300px"
                multiDisplayLimit={2}
                canEditOption={true}
            />
            <div style={{ paddingLeft: 10, paddingTop: 10 }}>
                {listData.length ? <h3 style={{color: '#475161'}}>Order the fields and create template</h3> : null}
                <div style={{ paddingTop: 10 }}>
                    <div>
                        {listData.length ? <Dropdown
                            dragDropProps={{
                                canDragAndDrop: true,
                                onDragEnd: onDragEnd
                            }}
                            list={listData}
                            type="click"
                        >
                            <Icon icon="CompactView" />
                        </Dropdown> : null}
                    </div>
                    <div style={{ paddingTop: 10 }}>
                        {listData.length > 0  && <Button onClick={() => handlePdfOrdering()} buttonType="secondary">{loading ? 'Loading...' : 'Genereate PDF'}</Button>}
                    </div>
                </div>
                <div>
                    {pdfUrl && <div><a href={pdfUrl} className="linkWrapper" target='_blank'>Click Here to Open PDF </a></div>}
                    {pdfUrl && <div><Button onClick={() => downloadPDF()} className="buttonWrapper" buttonType="secondary">Download PDF</Button></div>}
                </div>
            </div>
        </div>
    )
}

export default PdfWidget;

