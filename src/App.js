import React, { useState} from 'react'
import './App.css'
import MaterialTable from 'material-table'
import XLSX from 'xlsx'
const EXT = ['xlsx','xls', 'csv']


function App(){
  const [colHeaders, setColHeaders] = useState()
  const [data, setData] = useState()

  const getExt = (file) => {
    const before = file.name.split('.')
    const extn = before[before.length - 1]
    return EXT.includes(extn)
  }

  const convToJson = (headers, data) => {
    const rows = []
    data.forEach(row => {
      let rowData = {}
      row.forEach((element,index) => {
        rowData[headers[index]] = element
      })
      rows.push(rowData)
    })
    return rows
  }

  const imp = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const st = event.target.result
      const book = XLSX.read(st,{type:"binary"})
      const sheetName = book.SheetNames[0]
      const sheet = book.Sheets[sheetName]
      const fileData = XLSX.utils.sheet_to_json(sheet, {header:1})
      const headers = fileData[0]
      const heads = headers.map(head=> ({
        title: head,
        field: head
      }))
      setColHeaders(heads)
      fileData.splice(0,1)
      setData(convToJson(headers,fileData))
    }
    if (file) {
      if (getExt(file)) {
        reader.readAsBinaryString(file)
      }
      else {
        alert("Invalid File extension. CSV or Excel files only!")
      }
    }
    else {
      setData([])
      setColHeaders([])
    }
  }
  return (
    <div className="App">
      <h1 align="center">CSV-Handler</h1>
      <h3 align="center">Import your CSV, XLSX, or XLS file</h3>
      <input type="file" onChange={imp} />
      <MaterialTable title="Your Data" data={data} columns={colHeaders} />
    </div>
  )
}


export default App