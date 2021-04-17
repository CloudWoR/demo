import { Connection, Request } from 'tedious'
import moment from 'moment'

// Create connection to database
const config = {
  server: '192.168.11.218',
  authentication: {
    type: 'default',
    options: {
      userName: 'kiosk',
      password: 'kiosk'
    }
  },
  options: {
    encrypt: false
  }
}

// const connection = new Connection(config)

// connection.on('connect', (err) => {
//   if (err) {
//     console.log('Connection Failed')
//     throw err
//   }
//   console.log('connected')
//   executeStatement()
// })

// connection.connect()

// function executeStatement () {
//   const sql = "SELECT * from tReportInfoKiosk where DJTime BETWEEN '2021-03-08 00:00:00' and '2021-03-08 23:59:59' and ModalityType = 'MG'"
//   const request = new Request(sql, (err, rowCount) => {
//     if (err) {
//       throw err
//     }
//     console.log('DONE!')
//     connection.close()
//   })

//   // Emits a 'DoneInProc' event when completed.
//   request.on('row', (columns) => {
//     columns.forEach((column) => {
//       if (column.value === null) {
//         console.log('NULL')
//       } else {
//         console.log(column.value)
//       }
//     })
//   })

//   // In SQL Server 2000 you may need: connection.execSqlBatch(request)
//   connection.execSql(request)
// }

class SqlServer {
  constructor () {
    if (!SqlServer.instance) {
      SqlServer.instance = this
    }
    return SqlServer.instance
  }

  dateFormat (date, format) {
    const value = moment(date).format(format) === 'Invalid date' ? '' : moment(date).format(format)
    return value
  }

  query (sql) {
    const connection = new Connection(config)
    connection.connect()
    return new Promise((resolve, reject) => {
      connection.on('connect', async (err) => {
        if (err) reject(err)
        const request = new Request(sql, (err, rowCount) => {
          if (err) reject(err)
          connection.close()
        })
        const rows = []
        request.on('row', columns => {
          const requestArray = {}
          columns.forEach(item => {
            requestArray[item.metadata.colName] = item.metadata.type.name === 'DateTimeN' ? this.dateFormat(item.value, 'YYYY-MM-DD HH:mm:ss') : item.value
          })
          rows.push(requestArray)
        })
        request.on('doneProc', () => {
          resolve(rows)
        })
        connection.execSql(request)
      })
    })
  }
}

export default SqlServer
