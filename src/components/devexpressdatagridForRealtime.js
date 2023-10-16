
import { Column, FilterRow, GroupPanel, Grouping, Pager, Paging, Sorting, Summary, TotalItem } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { DataGrid } from 'devextreme-react';
import { useEffect, useState } from 'react';
import { searchIndex } from '@/lib/helper';
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";


export default function DevExpressDataGridRealTime(props) {
    const [autoExpandAll, setAutoExpandAll] = useState(false)

    let DataGridRef = null
    let setColumns = []

    const arrayStore = new ArrayStore({
        key: 'id',
        data: props.ArrayStoreData,
    });

    const dataSource = new DataSource({
        store: arrayStore,
        reshapeOnPush: true,
    });

    useEffect(() => {
        columnDraw()

        // forceRefresh(true)
    }, [])

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

        setColumns = columns
        // setColumns(columns)
    }

    const cellRenderPrice = (data) => {
        if (data?.data?.price < 0) {
            return (
                <div>
                    <p className="text-danger"><AiOutlineArrowDown />{data?.data?.price}</p>
                </div>
            )
        }
        return (
            <div>
                <p className="text-success"><AiOutlineArrowUp />{data?.data?.price}</p>
            </div>
        )
        // <button className="btn btn-sm bg-dapen-default text-white text-center" onClick={() => {this.generateLockKsei(data.data)}}>Generate</button>
    }

    return (
        <DataGrid
            ref={(ref) => { DataGridRef = ref }}
            id={'grid'}
            keyExpr={props.keyField ? props.keyField : "id"}
            repaintChangesOnly={true}
            columnAutoWidth={true}
            dataSource={dataSource}
            showBorders={props.showBorders}
            allowColumnReordering={true}
            allowColumnResizing={true}
            allowFiltering={true}
            columnMinWidth={20}
            export={{
                enabled: props.exportExcel,
                fileName: props.exportFileName,
                allowExportSelectedData: props.allowExportSelectedData
            }}
        >
            <GroupPanel visible={props.grouping} allowColumnDragging={true} />
            <Grouping autoExpandAll={autoExpandAll} />
            <FilterRow visible={props.FilterRow || false} />
            <Paging defaultPageSize={props.defaultPageSize || 10} enabled={props.paging} />
            <Pager
                showPageSizeSelector={props.showPageSizeSelector || false}
                allowedPageSizes={[5, 10, 20]}
                showInfo={true} />

            <Sorting
                mode={props.sortingMode || 'multiple'}
            />
            {/* {
                setColumns.map(column => {
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
            } */}
            <Column
                dataField="code"
                dataType="string"
                width={'100px'} />
            <Column
                dataField="name"
                dataType="string"
                width={'200px'} />
            <Column
                dataField="price"
                dataType="string"
                width={'100px'}
                cellRender={cellRenderPrice} />
            {/* <Summary>
                <TotalItem column="price" summaryType="sum" displayFormat="{0}" />
            </Summary> */}
        </DataGrid>
    )
}