import { search, searchIndex } from '@/lib/helper';
import DataGrid, { Column, Popup, Form, Editing, FilterRow, GroupItem, GroupPanel, Grouping, Pager, Paging, Sorting, Summary, TotalItem, ColumnChooser, ColumnFixing, Scrolling, HeaderFilter, SearchPanel, Search } from 'devextreme-react/data-grid';
import { useEffect, useReducer, useState } from "react";
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';

export default function DevExpressDataGrid(props) {
    let elementLoaded = false
    let ArraySourceData = []
    let refreshForced = false
    let totalCount = 0
    let loadedRow = []
    let focusedRow = {}
    let useArraySource = props.useArraySource === undefined ? false : props.useArraySource
    let menuRightClick = typeof props.menuRightClick === 'boolean' ? props.menuRightClick : true

    let customDataSource = new CustomStore({
        key: props.keyField || 'id',
        load: async (loadOptions) => {
            let params = "?";

            if (props.remoteOperations) {
                if (!isNaN(loadOptions.skip) && !isNaN(loadOptions.take)) {
                    params += `page=${(loadOptions.skip / loadOptions.take)}&`
                    params += `size=${loadOptions.take}&`
                }


                if (loadOptions.filter === undefined && loadOptions.select === undefined && params.length === 1) {
                    params += `page=0&`
                    params += `size=${totalCount}&`
                }

                if (loadOptions.sort) {
                    params += loadOptions.sort.map(value => {
                        return (`sort=${value.selector},${value.desc ? 'desc' : 'asc'}&`)
                    }).join('')
                }

                if (loadOptions.filter) {
                    var filterParam = loadOptions.filter.filter(value => Array.isArray(value))

                    if (filterParam.length == 0) {
                        var operations
                        switch (loadOptions.filter[1]) {
                            case '<': operations = 'lessThan'
                                break
                            case '<=': operations = 'lessThanOrEqual'
                                break
                            case '>': operations = 'greaterThan'
                                break
                            case '>=': operations = 'greaterThanOrEqual'
                                break
                            case '=': operations = 'equals'
                                break
                            case '<>': operations = 'notEquals'
                                break
                            default: operations = loadOptions.filter[1]
                                break
                        }

                        params += `${loadOptions.filter[0]}.${operations}=${loadOptions.filter[2]}&`

                    } else {
                        params += filterParam.map(value => {
                            var operations

                            if (value.filterValue instanceof Date) {
                                var dateFilter = value.filter(value => Array.isArray(value))

                                var filterText = dateFilter.map((value, index) => {
                                    switch (value[1]) {
                                        case '<': operations = 'lessThan'
                                            break
                                        case '<=': operations = 'lessThanOrEqual'
                                            break
                                        case '>': operations = 'greaterThan'
                                            break
                                        case '>=': operations = 'greaterThanOrEqual'
                                            break
                                        case '=': operations = 'equals'
                                            break
                                        case '<>': operations = 'notEquals'
                                            break
                                    }

                                    return (`${value[0]}.${operations}=${value[2]}&`)
                                }).join('')

                                return (filterText)
                            } else {
                                switch (value[1]) {
                                    case '<': operations = 'lessThan'
                                        break
                                    case '<=': operations = 'lessThanOrEqual'
                                        break
                                    case '>': operations = 'greaterThan'
                                        break
                                    case '>=': operations = 'greaterThanOrEqual'
                                        break
                                    case '=': operations = 'equals'
                                        break
                                    case '<>': operations = 'notEquals'
                                        break
                                }

                                return (`${value[0]}.${operations}=${value[2]}&`)
                            }
                        }).join('')
                    }
                }
            }

            if (props.loadAPI.includes('?')) {
                params = '&' + params.slice(1, params.length)
            }

            params = params.slice(0, -1);
            let response

            if (props.useArraySource && props.ArraySourceData && ((ArraySourceData.data ? ArraySourceData.data.length === 0 : ArraySourceData.length === 0) || refreshForced)) {
                if (typeof props.ArraySourceData === 'function') {
                    ArraySourceData = await props.ArraySourceData(params)
                } else {
                    ArraySourceData = props.ArraySourceData
                }
            } else if (props.useArraySource && props.ArraySourceData && props.remoteOperations) {
                if (typeof props.ArraySourceData === 'function') {
                    ArraySourceData = await props.ArraySourceData(params)
                } else {
                    ArraySourceData = props.ArraySourceData
                }
            }

            if (((ArraySourceData.data ? ArraySourceData.data.length === 0 : ArraySourceData.length === 0) || !props.useArraySource) && !props.ArraySourceData) {
                if (props.remoteOperations) {
                    if (loadOptions.isLoadingAll) {
                        const loopCount = totalCount / 1000
                        let data = []
                        for (let index = 0; index <= loopCount; index++) {
                            params = "?"
                            params += `page=${index}&`
                            params += `size=${1000}&`

                            if (props.loadAPI.includes('?')) {
                                params = '&' + params.slice(1, params.length)
                            }

                            params = params.slice(0, -1);

                            const responseLoop = await httpRequest(props.backendserver, props.store, props.loadAPI + params, 'GET', null, true)

                            data = [...data, ...responseLoop.data]
                        }

                        response = {
                            data: data,
                            totalCount: totalCount,
                        }

                        ArraySourceData = response.data
                    } else {
                        response = await httpRequest(props.backendserver, props.store, props.loadAPI + params, 'GET', null, true)

                        response.headers['x-total-count'] = response.headers['x-total-count'] || response.data.length

                        response = {
                            data: response.data,
                            totalCount: parseInt(response.headers['x-total-count']),
                        }

                        totalCount = response.totalCount

                        ArraySourceData = response.data
                    }
                } else {
                    if (refreshForced || (ArraySourceData.data ? ArraySourceData.data.length === 0 : ArraySourceData.length === 0)) {
                        response = await httpRequest(props.backendserver, props.store, props.loadAPI, 'GET', null, true)

                        response.headers['x-total-count'] = response.headers['x-total-count'] || response.data.length

                        response = {
                            data: response.data,
                            totalCount: parseInt(response.headers['x-total-count']),
                        }

                        ArraySourceData = response
                    } else {
                        response = ArraySourceData
                    }
                }
            } else {
                response = ArraySourceData
            }

            if (refreshForced) {
                refreshForced = false
            }
            return response
        },
        insert: async (values) => {
            if (useArraySource) {
                values.id = uuidv4()
                ArraySourceData.push(values)

            } else {
                await httpRequest(props.backendserver, props.store, props.insertAPI, 'POST', {
                    values: values
                })

                forceRefresh(true)
            }
        },
        update: async (key, values) => {
            if (useArraySource) {
                var rowUpdated = ArraySourceData.findIndex(element => element[props.keyField || 'id'] == key)

                for (var entry of Object.entries(values)) {
                    let keyObject = entry[0];
                    let value = entry[1];

                    ArraySourceData[rowUpdated][keyObject] = value
                }
            } else {
                await httpRequest(props.backendserver, props.store, props.updateAPI, 'PUT', {
                    values: values,
                    key: key
                }, focusedRow)

                forceRefresh(true)
            }
        },
        remove: async (key) => {
            if (useArraySource) {
                if (key.length != 36) {
                    DeletedIndex.push(key)
                }

                var rowUpdated = ArraySourceData.findIndex(element => element[props.keyField || 'id'] == key)

                ArraySourceData.splice(rowUpdated, 1)

            } else {
                await httpRequest(props.backendserver, props.store, props.deleteAPI, 'DELETE', key)
                forceRefresh(true)
            }
        },
        onPush: (changes) => {
            for (var change of changes) {
                switch (change.type) {
                    case 'insert':
                        var keyField = props.keyField || 'id'

                        if (change.data[keyField] == null) {
                            change.data[keyField] = uuidv4()
                        }
                        ArraySourceData.push(change.data)

                        if (props.onRowUpdated && props.usePushEvent) {
                            props.onRowUpdated({
                                key: change.data[keyField],
                                data: change.data
                            })
                        }
                        break;
                    case 'update':
                        var rowUpdated = ArraySourceData.findIndex(element => element[props.keyField || 'id'] == change.key)

                        for (var entry of Object.entries(change.data)) {
                            let keyObject = entry[0];
                            let value = entry[1];

                            ArraySourceData[rowUpdated][keyObject] = value
                        }

                        if (props.onRowUpdated && props.usePushEvent) {
                            props.onRowUpdated({
                                key: ArraySourceData[rowUpdated][props.keyField || 'id'],
                                data: ArraySourceData[rowUpdated]
                            })
                        }
                        break;
                    case 'remove':
                        if (change.key.length != 36) {
                            DeletedIndex.push(change.key)
                        }

                        var rowUpdated = ArraySourceData.findIndex(element => element[props.keyField || 'id'] == change.key)

                        ArraySourceData.splice(rowUpdated, 1)
                        break;
                    default:
                        break;
                }
            }
        },
        onLoaded: () => {
            if (typeof props.triggerDataLoaded === 'function' && !elementLoaded) {
                setTimeout(() => {
                    props.triggerDataLoaded()
                }, 500)
                elementLoaded = true
            }
        }
    })


    let DataGridRef = null
    const [columns, setColumns] = useState([])
    const [autoExpandAll, setAutoExpandAll] = useState(false)
    // const [dataSource, setDataSource] = useState(new DataSource({
    //     store: customDataSource,
    //     reshapeOnPush: true
    // }))

    useEffect(() => {
        columnDraw()

        updateEditor({
            allowAdding: props.allowAdding,
            allowUpdating: props.allowUpdating,
            allowDeleting: props.allowDeleting,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onEditingStart = (e) => {
        if (props.editingMode !== 'cell' && props.editingMode !== 'batch') {
            focusedRow = e.data

            delete focusedRow.procId
        }
    }

    const onExporting = (e) => {

    }

    const onExportingWithFormatNum = (e) => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(props.exportFileName);
        exportDataGrid({
            component: e.component,
            worksheet,
            customizeCell: ({ gridCell, excelCell }) => {
                if (gridCell.rowType === 'data') {
                    if (gridCell.column.dataType == 'number') {
                        excelCell.value = parseFloat(gridCell.value, 10);
                        excelCell.numFmt = '#,##0.00'
                    }
                }
            },
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), props.exportFileName + '.xlsx');
            });
        })
        e.cancel = true
    }

    const onInitNewRow = (e) => {
        if (props.columnDefaultValue !== null && props.columnDefaultValue !== undefined) {
            props.columnDefaultValue.forEach((element, index) => {
                e.data[element.dataField] = element.value
            })
        }
        // console.log('initNew',e)
    }

    const onRowInserting = (e) => {
        // console.log('inserting',e)
    }

    const onRowInserted = (e) => {
        let type = 'success'
        let text = 'Data successfully inserted!'

        notify({ message: text, width: 'AUTO', shading: true, position: { at: 'center', my: 'center', of: window } }, type, 600);
    }

    const onRowUpdating = (e) => {
        // console.log('updating',e)
    }

    const onRowUpdated = (e) => {
        let type = 'success'
        let text = 'Data successfully updated!'

        notify({ message: text, width: 'AUTO', shading: true, position: { at: 'center', my: 'center', of: window } }, type, 600);
    }

    const onRowRemoving = (e) => {
        // console.log('removing',e)
    }

    const onRowExpanded = (e) => {
        if (!loadedRow.some(value => value === e.key) && props.useDelayExpand) {
            DataGridRef.instance.collapseRow(e.key)
            expandedRowKey = e.key
        }
    }

    const onRowRemoved = (e) => {
        let type = 'success'
        let text = 'Data successfully deleted!'

        notify({ message: text, width: 'AUTO', shading: true, position: { at: 'center', my: 'center', of: window } }, type, 600);
    }

    const onContextMenuPreparing = (e) => {
        if (menuRightClick) {
            var contextMenu = []
            if (props.allowUpdating) {
                contextMenu.push({
                    text: "Ubah",
                    onItemClick: () => {
                        DataGridRef.instance.editRow(e.row.rowIndex);
                    }
                });
            }

            if (props.allowDeleting) {
                contextMenu.push({
                    text: "Hapus",
                    onItemClick: () => {
                        DataGridRef.instance.deleteRow(e.row.rowIndex);
                    }
                });
            }

            var buttonConfig = search('buttons', 'type', props.ColumnConfiguration)
            if (buttonConfig) {
                buttonConfig.buttons.forEach((value, index) => {
                    if (typeof value === 'object') {
                        contextMenu.push({
                            text: value.text,
                            onItemClick: () => { value.onClick(e) }
                        });
                    }
                })
            }

            if (e.row) {
                if (e.row.rowType === "data") {
                    e.items = contextMenu;
                }
            }
        }
    }

    const onFocusedCellChanged = (e) => {

    }

    const columnDraw = () => {
        let columns = props.ColumnConfiguration
        let menuRightClick = typeof props.menuRightClick === 'boolean' ? props.menuRightClick : true
        let buttonIndex = searchIndex('buttons', 'type', columns)

        if (buttonIndex !== undefined) {
            if (props.grouping) {
                columns[buttonIndex].buttons.push({
                    text: "Expand / Collapse All",
                    type: "default",
                    onClick: () => {
                        setAutoExpandAll(true)
                    },
                })
            }
            columns[buttonIndex].caption = 'Action'
            columns[buttonIndex].visible = !menuRightClick
            // console.log(columns[buttonIndex])
        } else {
            if (props.editingMode !== 'cell') {
                var buttons = []
                if (props.allowUpdating) {
                    buttons.push('edit')
                }

                if (props.allowDeleting) {
                    buttons.push('delete')
                }

                if (props.grouping) {
                    buttons.push({
                        itemType: "button",
                        buttonOptions: {
                            text: "Expand / Collapse All",
                            type: "default",
                            onClick: () => {
                                setAutoExpandAll(true)
                            },
                        },
                        horizontalAlignment: "left"
                    })
                }

                if (buttons.length > 0) {
                    columns.push({
                        type: 'buttons',
                        caption: "Action",
                        buttons: buttons,
                        visible: !menuRightClick
                    })
                }
            }
        }


        setColumns(columns)
    }

    const forceRefresh = (param = false) => {
        refreshForced = param
        DataGridRef.instance.refresh(true)
    }

    const push = (data) => {
        customDataSource.push(data)
    }

    const updateEditor = (prop) => {
        DataGridRef.instance.beginUpdate()
        DataGridRef.instance.option('editing.allowAdding', prop.allowAdding)
        DataGridRef.instance.option('editing.allowUpdating', prop.allowUpdating)
        DataGridRef.instance.option('editing.allowDeleting', prop.allowDeleting)
        DataGridRef.instance.endUpdate()
    }

    const onSelectionChanged = (e) => {
        let selectedRowKeys = e.selectedRowKeys
        DataGridRef.instance.selectRows(selectedRowKeys)

        if (typeof props.onSelectionChanged === 'function') {
            props.onSelectionChanged(e)
        }
    }

    return (
        <DataGrid
            ref={(ref) => { DataGridRef = ref }}
            id={'grid'}
            keyExpr={props.keyField ? props.keyField : "id"}
            dataSource={props.dataSource}
            showBorders={props.showBorders}
            repaintChangesOnly={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            allowFiltering={true}
            columnAutoWidth={true}
            columnMinWidth={20}
            export={{
                enabled: props.exportExcel,
                fileName: props.exportFileName,
                allowExportSelectedData: props.allowExportSelectedData
            }}
            onExporting={props.exportWithFormatNum ? onExportingWithFormatNum : props.onExporting || onExporting}
            remoteOperations={props.remoteOperations ? { sorting: true, paging: true, filtering: true } : false}

            onEditingStart={onEditingStart}
            onInitNewRow={props.onInitNewRow || onInitNewRow}
            onRowInserting={props.onRowInserting || onRowInserting}
            onRowInserted={props.onRowInserted || onRowInserted}
            onRowUpdating={props.onRowUpdating || onRowUpdating}
            onRowUpdated={props.onRowUpdated || onRowUpdated}
            onRowRemoving={props.onRowRemoving || onRowRemoving}
            onRowRemoved={props.onRowRemoved || onRowRemoved}
            onFocusedCellChanged={props.onFocusedCellChanged || onFocusedCellChanged}
            onCellPrepared={props.onCellPrepared}
            onEditorPreparing={props.onEditorPreparing}
            onContextMenuPreparing={onContextMenuPreparing}

            onRowExpanded={onRowExpanded}

            selection={{
                mode: props.selection || 'single',
                showCheckBoxesMode: 'always',
                allowSelectAll: true,
                selectAllMode: props.selectAllMode || "allPages"
            }}
            onSelectionChanged={onSelectionChanged}
            height={props.height || 'calc(100vh - 305px)'}
            hoverStateEnabled={true}
            rowAlternationEnabled={true}
        >
            <GroupPanel visible={props.grouping} allowColumnDragging={true} />
            <Grouping autoExpandAll={autoExpandAll} />
            <FilterRow visible={props.FilterRow || false} />
            <HeaderFilter visible={props.headerFilter || false} />
            <SearchPanel visible={props.searchPanel || false}
                width={240}
                placeholder={props.textSearchPanel || "Search..."} />
            <Paging defaultPageSize={props.defaultPageSize || 10} enabled={props.paging} />
            <Pager
                showPageSizeSelector={props.showPageSizeSelector || false}
                allowedPageSizes={[5, 10, 20]}
                showInfo={true} />

            <Sorting
                mode={props.sortingMode || 'multiple'}
            />
            {
                columns.map((column) => {
                    console.log(column);
                    var editorType = column.editorType === 'dxSelectBox' ? null : column.editorType
                    var editorOptions = column.editorType === 'dxSelectBox' ? null : column.editorOptions
                    return (<Column
                        key={column.name || column.dataField || 'buttons'}
                        dataField={column.dataField}
                        name={column.name}
                        caption={column.caption}
                        lookup={column.lookup}
                        cellRender={column.cellRender}
                        alignment={column.alignment || 'left'}
                        cssClass={column.cssClass}
                        format={column.format}
                        dataType={column.dataType}
                        width={column.width}
                        type={column.type}
                        buttons={column.buttons}
                        editorType={editorType}
                        editorOptions={editorOptions}
                        visible={column.visible}
                        sortOrder={column.sortOrder}
                        allowEditing={column.allowEditing}
                        calculateCellValue={column.calculateCellValue}
                        setCellValue={column.setCellValue}
                        groupIndex={column.groupIndex}
                        fixed={column.fixed}
                        fixedPosition={column.fixedPosition}
                        validationRules={column.validationRules}
                    >
                        {
                            (column.columns || []).map((columnDetail) => {
                                return (<Column
                                    key={column.name || column.dataField || 'buttons'}
                                    dataField={columnDetail.dataField}
                                    name={columnDetail.name}
                                    caption={columnDetail.caption}
                                    lookup={columnDetail.lookup}
                                    cellRender={columnDetail.cellRender}
                                    alignment={columnDetail.alignment || 'left'}
                                    cssClass={columnDetail.cssClass}
                                    format={columnDetail.format}
                                    dataType={columnDetail.dataType}
                                    width={columnDetail.width}
                                    type={columnDetail.type}
                                    buttons={columnDetail.buttons}
                                    // editorType = {columnDetail.editorType}
                                    // editorOptions = {columnDetail.editorOptions}
                                    visible={columnDetail.visible}
                                    sortOrder={columnDetail.sortOrder}
                                    allowEditing={columnDetail.allowEditing}
                                    calculateCellValue={columnDetail.calculateCellValue}
                                    setCellValue={columnDetail.setCellValue}
                                    groupIndex={columnDetail.groupIndex}
                                    validationRules={columnDetail.validationRules}
                                />)
                            })
                        }
                    </Column>)
                })
            }

            <Summary
                calculateCustomSummary={props.calculateCustomSummary}
                recalculateWhileEditing={true}
            >
                {
                    (props.groupSummary || []).map((groupItem) => {
                        return <GroupItem
                            key={groupItem.name || groupItem.column}
                            alignByColumn={groupItem.alignByColumn}
                            column={groupItem.column}
                            customizeText={groupItem.customizeText}
                            displayFormat={groupItem.displayFormat}
                            name={groupItem.name}
                            showInColumn={groupItem.showInColumn}
                            showInGroupFooter={groupItem.showInGroupFooter}
                            skipEmptyValues={groupItem.skipEmptyValues}
                            summaryType={groupItem.summaryType}
                            valueFormat={groupItem.valueFormat}
                        />
                    })
                }
                {
                    (props.summaryTotalItem || []).map((column) => {
                        return <TotalItem
                            key={column.name || column.column || column.showInColumn}
                            name={column.name}
                            summaryType={column.summaryType}
                            valueFormat={column.valueFormat}
                            displayFormat={column.displayFormat}
                            showInColumn={column.showInColumn}
                            column={column.column}
                            customizeText={column.customizeText}
                        />
                    })
                }
            </Summary>
            <Editing
                refreshMode={'reshape'}
                mode={props.editingMode || 'popup'}
                useIcons={true}

                texts={
                    {
                        saveRowChanges: 'Simpan',
                        cancelRowChanges: 'Batal',
                        deleteRow: 'Hapus',
                        editRow: 'Ubah'
                    }
                }
            >
                <Popup
                    title={props.popupTitle}
                    showTitle={true}
                    width={props.popupWidth || 600}
                    height={props.popupHeight || 300}
                    dragEnabled={true}
                    resizeEnabled={true}
                >
                </Popup>
                <Form
                    id={'form'}
                    showColonAfterLabel={true}
                    labelLocation={props.popupFormLabelLocation || 'top'}
                    minColWidth={props.popupFormMinColWidth || 300}
                    colCount={props.popupFormColCount || 1}
                    items={props.formItems}
                />
            </Editing>
            <ColumnChooser enabled={props.ColumnChooser || false} />
            <ColumnFixing enabled={props.ColumnFixing || false} />
            <Scrolling showScrollbar="always" />
        </DataGrid>
    )
}