import { customers } from '@/dummy_data/data';
import DevExpressDataGrid from '@/components/devexpressdatagrid';
import { handleSessionToken, handleSessionUser } from '@/lib/helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Product(props) {
    const store = props.store;
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

    const destroySession = () => {
        handleSessionToken('destroy', store, router, '/', dispatch)
        handleSessionUser('destroy', store, dispatch)
    }

    useEffect(() => {
        handleSessionToken('checkSession', store, router, '/')
    }, [])

    return (
        <>

            <p>{getUserData.sessionUser.firstName}</p>
            <button onClick={destroySession}>Logout</button>
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
                popupHeight={450} //masukkan dalam ukuran pixel
                popupFormLabelLocation='left' //accepted value = top, left, right
                popupFormMinColWidth={300} // minimum lebar kolom
                popupFormColCount={1} //jumlah kolom pada form

                formItems={columns}
                ColumnChooser={true} // set false agar kolom tidak dapat di pindah pindah
                ColumnFixing={true} // set false agar kolom tidak dapat di freeze
            />
        </>

    )
}