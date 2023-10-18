import { customers } from '@/dummy_data/data';
import DevExpressDataGrid from '@/components/devexpressdatagrid';
import { handleSessionToken, handleSessionUser } from '@/lib/helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HeadMetaData } from '@/components/headMetaTag';

export default function Product(props) {
    const { store } = props;
    const router = useRouter()
    const dispatch = useDispatch()
    const getUserData = handleSessionUser('getSession', store, dispatch)
    const columns = [
        {
            dataField: 'CompanyName',
            caption: 'Company Name',
        },
        {
            dataField: 'Address',
            caption: 'Address',
        },
        {
            dataField: 'City',
            caption: 'City',
            headerFilter: true
        },
        {
            dataField: 'PriceHouse',
            caption: 'Price House',
        },
    ]

    const summary = [
        {
            displayFormat: 'Total :',
            showInColumn: 'City'
        },
        {
            name: 'PriceHouse',
            column: 'PriceHouse',
            summaryType: 'sum',
            valueFormat: '#,##0.00',
            displayFormat: '{0}'
        },
    ]

    useEffect(() => {
        handleSessionToken('checkSession', store, router, '/')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <HeadMetaData
                title="Product"
                ogImageUrl="https://cdn.discordapp.com/attachments/1050790741334569091/1151943122117480558/V6_Academy_Banner_Assets.png"
                metaDescription="Data Maintenance"
            />
            <div className='position-relative h-100'>
                <div className='position-absolute top-50 start-50 translate-middle rounded-4 p-4' style={{ backgroundColor: "", width: "84vw", height: "90vh", boxShadow: "0px 0px 10px 0px rgba(122,118,122,1)" }}>
                    <h2 className="main-title mb-3">Product</h2>
                    <DevExpressDataGrid
                        allowAdding={true}
                        allowDeleting={true}
                        allowUpdating={true}

                        dataSource={customers}
                        keyField="ID"

                        menuRightClick={true}
                        showBorders={true}
                        selection={"multiple"}
                        FilterRow={true}

                        paging={true}
                        defaultPageSize={10}

                        ColumnConfiguration={columns}
                        summaryTotalItem={summary}

                        popupTitle={'Article Data'}
                        popupWidth={600} //masukan dalam ukuran pixel
                        popupHeight={700} //masukkan dalam ukuran pixel
                        popupFormLabelLocation='left' //accepted value = top, left, right
                        popupFormMinColWidth={300} // minimum lebar kolom
                        popupFormColCount={1} //jumlah kolom pada form

                        formItems={columns}
                        ColumnChooser={true} // set false agar kolom tidak dapat di pindah pindah
                        ColumnFixing={true} // set false agar kolom tidak dapat di freeze
                    />
                </div>
            </div>
        </>

    )
}