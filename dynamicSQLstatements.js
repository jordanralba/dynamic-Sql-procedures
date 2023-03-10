//Define structure of table based on preset JSON schema
    //refrain from including a col to prevent access to possible confidential information
//const tableData = require("./tablestructure.json")
const dynamicSql = (tableData, operation, tNum, filters = [], ) => {

    sqlOp = [
        {name: 'select', structure: [' SELECT ', ' FROM ']}, 
        {name: 'insert', structure: [' INSERT INTO ', '(', ') VALUES (', ')']},
        {name: 'update', structure: [' UPDATE ', ' SET ']},
        {name: 'innerjoin', structure: [' INNER JOIN ', ' ON ', ' OR ']},        
        {name: 'delete', structure: [' DELETE ', ' FROM ']}, 

    ],
    sqlFilter = [
        {name: 'limit', structure: ' LIMIT '},
        {name: 'orderby', structure: ' ORDER BY '},
        {name: 'where', structure: ' WHERE '},
    ];
    const targetTable = tableData[tNum];
    const rootTable = tableData[0];        
    const dbTableQueries = []; //nest inside of for() to have single table run 

    for(let i = 0;i < tableData.length;i++){
        const table = tableData[tNum];
        const colAmount = table.cols.length;
        const fTableData = []; 
        const placeHolder = [];
        if(colAmount >= 0){
            for(let c=colAmount;c > 0;c--){
             placeHolder.push('?');
            }
        }
        console.log(placeHolder);
        if(operation === 'select'){
           const queryStatement = sqlOp[0].structure[0] + table.cols.join(', ') + sqlOp[0].structure[1] + table.name;
            dbTableQueries.push(queryStatement + ";");
        }if(operation === 'delete'){
           const queryStatement = sqlOp[4].structure[0] + table.cols.join(', ') + sqlOp[4].structure[1] + table.name + sqlFilter[2].structure + table.name + '.id = ?';
            dbTableQueries.push(queryStatement + ";");
        }if(operation === 'insert'){
             const queryStatement = sqlOp[1].structure[0] + table.name + sqlOp[1].structure[1] + table.cols.join(', ') + sqlOp[1].structure[2] + placeHolder.join(', ') + sqlOp[1].structure[3];
             dbTableQueries.push(queryStatement+";");
        }if(operation === 'update'){
            const queryStatement = sqlOp[2].structure[0] + table.name + sqlOp[2].structure[1] + table.cols.join(' = ?, ') + ' = ? ' + sqlFilter[2].structure + table.name +'.id = ?';
            dbTableQueries.push(queryStatement+";");

        }
        for(let r =0;r<table.fKeys.length;r++){
            const fName = table.fKeys[r].table;
            fTableData.push(tableData.filter(element => element.name == fName));
           //console.log(fTableData[r].cols[0]);
            const queryStatement = [];

            if(operation === 'innerjoinup'){            
                const iJStatement = [];

            if(table.fKeys[r].names.length > 0 && typeof fTableData[r][0] !== 'undefined'){
                //console.log(fTableData[r][0].name);                    
                queryStatement.push(sqlOp[0].structure[0] + table.cols.join(', ') + ', ' + fTableData[r][0].cols + sqlOp[0].structure[1] + table.name);
                if (table.fKeys[r].names.length > 1){
                    iJStatement.push(sqlOp[3].structure[0] + fTableData[r][0].name + sqlOp[3].structure[1] + fTableData[r][0].name + '.id = ' + table.name+'.' + table.fKeys[r].names[r] + sqlOp[3].structure[2] + fTableData[r][0].name + '.id = ' + table.name+'.' + table.fKeys[r].names[r+1]);
                }else{                    
                    //queryStatement.push(sqlOp[0].structure[0] + table.cols.join(', ') + ', ' + fTableData[r][0].cols + sqlOp[0].structure[1] + table.name);
                    iJStatement.push(sqlOp[3].structure[0] + fTableData[r][0].name + sqlOp[3].structure[1] + fTableData[r][0].name + '.id = ' + table.name+'.' + table.fKeys[r].names);
                }                    
                
                

            }else{
                queryStatement.push(sqlOp[0].structure[0] + table.cols.join(', ') + sqlOp[0].structure[1] + table.name);
                dbTableQueries.push(queryStatement);
                }
                dbTableQueries.push(queryStatement+iJStatement.join('')+";");    
                console.log(dbTableQueries);
                //console.log(dbTableQueries);

            }/*if(operation === 'innerjoindown'){
                const queryStatement = [];
                if(typeof tableData[i-1] !== 'undefined'){
                    queryStatement.push(sqlOp[0].structure[0] + table.cols.join(', ')+ ', ' + tableData[i-1].cols.join(', ') + sqlOp[0].structure[1] + table.name);
                    queryStatement.push(sqlOp[3].structure[0] + tableData[i-1].name + sqlOp[3].structure[1] + table.name + '.id = ' + table.name+'.'+table.fKeys[r].names);
                }else{queryStatement.push(sqlOp[0].structure[0] + table.cols.join(', ') + sqlOp[0].structure[1] + table.name)}
            }if(filters.length > 0){
                for(filter of filters){
                    if(filter.type === 'where' && filter.fname === 'findbyID'){queryStatement += sqlFilter[2].structure + table.name + filter.condition}
                    if(filter.type === 'where' && filter.fname !== 'findbyID'){queryStatement += sqlFilter[2].structure + filter.condition}
                    if(filter.type === 'orderby'){queryStatement += sqlFilter[1].structure + table.name + filter.condition}
                    if(filter.type === 'limit'){queryStatement += sqlFilter[0].structure + filter.condition}
                }return queryStatement + ';';
        
            }*/
            //console.log(dbTableQueries);
        } 
    }
      //return dbTableQueries.join(", ");
      return dbTableQueries[tNum];


}

exports.dynamicSql = dynamicSql;