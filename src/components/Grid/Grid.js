import { default as React } from 'react';
import { Map, List, Set, Record } from 'immutable';
import * as Widgets from '../widgets';

import { Column } from './Column';

const Grid = ({ rows, columns, components = new List() }) => {

  const defaultStyle = new Map({
    width: Math.floor(100/columns),
    height: Math.floor(100/rows),
    position: 'absolute',
    left: 0,
    right: 0
  });


  let defaultGrid = new Map(
    Array.apply(null, { length: rows })
         .map(Number.call, Number)
         .map((row) =>
           new Map(
             Array.apply(null, { length: columns })
                  .map(Number.call, Number)
                  .reduce((current, next, columnIndex) => (
                    Object.assign(current,
                      {
                        [next]: new Map({
                          style: new Map(Object.assign({}, defaultStyle.toObject(), {
                            top: defaultStyle.get('height') * row + '%',
                            left: defaultStyle.get('width') * columnIndex + '%',
                            width: defaultStyle.get('width') + '%',
                            height: defaultStyle.get('height') + '%',
                          })),
                          components: new Set(),
                          orientation: 'NORMAL',
                          disabled: false
                        })
                      })),
                    {})
           )
         )
         .reduce((current, next, rowIndex) => (Object.assign(current, { [rowIndex]: next })), {})
  );


  if(!components.isEmpty())
  {
    components.forEach(component => {
      const componentItem = component.toObject();

      const firstColumn = {
        row: componentItem.placement.first() === 0 ?  componentItem.placement.first() : (Math.floor(columns/componentItem.placement.first()) - 1),
        column: (componentItem.placement.first() % columns),
        number: componentItem.placement.first()
      };

      const lastColumn = {
        row: componentItem.placement.first() === 0 ?  componentItem.placement.first() : (Math.floor(columns/componentItem.placement.first()) - 1),
        column: (componentItem.placement.last() % columns),
        number: componentItem.placement.last()
      };

      // Get the amount of Vertical steps from origin to remove:
      const verticalSteps =  Math.floor(lastColumn.number / columns);
      const horizontalSteps = Math.ceil(lastColumn.number % columns) - Math.ceil(firstColumn.number % columns);

      // If the firstColumn has already been modified before - DO NOT modify it again. Leave the style, but append the component

      if(!defaultGrid.getIn([`${firstColumn.row}`, `${firstColumn.column}`, 'components']).isEmpty())
      {
        defaultGrid = defaultGrid.setIn([`${firstColumn.row}`, `${firstColumn.column}`, 'components'],
          defaultGrid.getIn([`${firstColumn.row}`, `${firstColumn.column}`, 'components']).push(...componentItem.components));

        return defaultGrid;
      }


      for(let row = firstColumn.row; row <= (firstColumn.row + verticalSteps); row++)
        for(let column = firstColumn.column; column <= (firstColumn.column + horizontalSteps); column++)

          if(row === firstColumn.row && column === firstColumn.column){
            defaultGrid = defaultGrid.setIn([`${row}`, `${column}`, 'style', 'height'],     defaultStyle.get('height') * (verticalSteps > 0 ? verticalSteps + 1 : 1) + '%')
                                     .setIn([`${row}`, `${column}`, 'style', 'width'],      defaultStyle.get('height') * (horizontalSteps > 0 ? horizontalSteps + 1 : 1) + '%')
                                     .setIn([`${row}`, `${column}`, 'style', 'top'],        defaultStyle.get('height') * row + `%`)
                                     .setIn([`${row}`, `${column}`, 'style', 'left'],       defaultStyle.get('width') * column + `%`)
                                     .setIn([`${row}`, `${column}`, 'components'],          defaultGrid.getIn([`${row}`, `${column}`, 'components'])
                                                                                                       .add(...componentItem.components))
                                     .setIn([`${row}`, `${column}`, 'orientation'], horizontalSteps > verticalSteps ? 'PORTRAIT' : 'LANDSCAPE');
          }
         else
           defaultGrid = defaultGrid.setIn([`${row}`, `${column}`, 'disabled'], true);

    });
  }

  return (
    <div className="grid" style={{height: '100%', clear: 'both'}}>
      {
        defaultGrid.toArray().map(row =>
          row.toArray().map( column =>
            column.get('disabled') === true ? null :
              <Column style={column.get('style').toJS()}>
                {
                  column.get('components').toArray().map((Component, key) => {

                    let Comp = Widgets[Component.class];

                    return <Comp {...Component.parameters} />;
                  })
                }
              </Column>
          )
        )
      }
    </div>
  )
};


export { Grid };
