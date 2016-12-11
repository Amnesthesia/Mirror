import { default as React } from 'react';
import { Map, List, Set } from 'immutable';
import * as Widgets from '../widgets';

import { Column } from './Column';

const ComponentGridModifications = (components, rows, columns) => {

  const defaultStyle = new Map({
    width: Math.floor(100/columns),
    height: Math.floor(100/rows),
    position: 'absolute',
    left: 0,
    right: 0
  });

  // Generate the grid as a Map with default style
  let gridColumns = new Map(
    Array.apply(null, { length: rows * columns })
         .map(Number.call, Number)
         .reduce((current, next) => (Object.assign(current, {[next]: new Map({ style: defaultStyle, components: new Set(), componentParameters: new Set(), orientation: 'NORMAL' }) })), {})
  );

  gridColumns = gridColumns.map((item, key) => {
    return item.setIn(['style', 'top'], (item.getIn(['style', 'height']) * Math.floor(key / columns)) + '%')
               .setIn(['style', 'left'], (item.getIn(['style', 'width']) * Math.floor(key % columns)) + '%')
  });


  if(components.count())
    components.map(itm => {
      var item = itm.toObject();

      if (item.placement.count() > 1) {
        let firstColumn = item.placement.first();
        let lastColumn = item.placement.last();

        // If the firstColumn has already been modified before - DO NOT modify it again. Leave the style, but append the component
        if(!gridColumns.getIn([`${firstColumn}`, 'components']).isEmpty())
          return gridColumns.setIn([`${firstColumn}`, 'components'], gridColumns.getIn([`${firstColumn}`, 'components']).push(...item.components));


        // Get the amount of Vertical steps from origin to remove:
        const verticalSteps = lastColumn % columns === 0 ? 2 : Math.ceil(lastColumn / columns);
        const horizontalSteps = Math.ceil((lastColumn % columns) + 1);


        const columnsToRemove = [...Array(rows*columns).keys()].map(i => {

          if(i < firstColumn)
            return null;

          if(i < firstColumn + horizontalSteps)
            return i;

          if(i > (verticalSteps*columns) + firstColumn)
            return null;

          if(i > lastColumn)
            return null;

          if(i >= columns)
            if(i % columns < horizontalSteps)
              return i;

          return null;
        }).filter(i => i !== null && i !== firstColumn);

        console.log('Removing items: ', columnsToRemove);


        // If the lastColumn is actually on different row, then the height should be increased to amount of rows it spans
        if (Math.ceil(firstColumn / columns) !== Math.ceil(lastColumn/columns)){

          gridColumns = gridColumns.setIn([`${firstColumn}`, 'style', 'height'], defaultStyle.get('height') * verticalSteps)
                                   .setIn([`${firstColumn}`, 'style', 'top'], (defaultStyle.get('height') * Math.floor(firstColumn/columns) + '%'))     // Top position is the default height multiplied by the row number
                                   .setIn([`${firstColumn}`, 'style', 'left'], (defaultStyle.get('width') * Math.floor(firstColumn % columns)) + '%')  // Left is the column number multiplied by default width
                                   .setIn([`${firstColumn}`, 'components'], gridColumns.getIn([`${firstColumn}`, 'components']).add(...item.components))
                                   .setIn([`${firstColumn}`, 'componentParameters'], gridColumns.getIn([`${firstColumn}`, 'componentParameters']).add(...item.componentParameters))
                                   .setIn([`${firstColumn}`, 'orientation'], 'PORTRAIT');

        }

        // Check if last column is not on the same row as first column
        if(Math.ceil(firstColumn % columns) !== Math.ceil(lastColumn % columns)) {

          gridColumns = gridColumns.setIn([`${firstColumn}`, 'style', 'width'], defaultStyle.get('width') * horizontalSteps)
                                   .setIn([`${firstColumn}`, 'components'], gridColumns.getIn([`${firstColumn}`, 'components']).add(...item.components)) // TODO: Find the actual component and not just the string here
                                   .setIn([`${firstColumn}`, 'componentParameters'], gridColumns.getIn([`${firstColumn}`, 'componentParameters']).add(...item.componentParameters))
                                   .setIn([`${firstColumn}`, 'style', 'top'], (defaultStyle.get('height') * Math.floor(firstColumn/columns)) + '%')
                                   .setIn([`${firstColumn}`, 'style', 'left'], (defaultStyle.get('width') * Math.floor(firstColumn % columns)) + '%')
                                   .setIn([`${firstColumn}`, 'orientation'], 'LANDSCAPE');



        }


        columnsToRemove.map(n => {
          gridColumns = gridColumns.remove(`${n}`);
        });
      }
      else{
        let columnNumber = item.placement.first();
        gridColumns = gridColumns.setIn([`${columnNumber}`, 'components'], gridColumns.getIn([`${columnNumber}`, 'components']).add(...item.components));
      }
    });

  gridColumns = gridColumns.map((item) => item.setIn(['style', 'width'], `${item.getIn(['style', 'width'])}%`).setIn(['style', 'height'], `${item.getIn(['style', 'height'])}%`));;

  // Ensure that, since the keys are string versions of numbers, they must come in the right order still
  return gridColumns.keySeq().map(key => parseInt(key, 10)).sort().map(n => gridColumns.get(`${n}`));
};

const Grid = ({ columns, rows, components=[] }) =>
  <div className="grid" style={{height: '100%', clear: 'both'}}>
    {
      ComponentGridModifications(components, rows, columns).map( (column, key) =>
        <Column style={column.get('style').toObject()} key={key}>
          {
            column.get('components').toArray().map((Component, key) => {

              let parameters = {};
              if(column.get('componentParameters').count() && column.get('componentParameters').get(Number(key)))
                parameters = column.getIn(['componentParameters', Number(key)]);
              else if(column.get('componentParameters').toArray().length > key)
                parameters = column.get('componentParameters').toArray()[key];

              let Comp = Widgets[Component];

              return <Comp {...parameters} />;
            })
          }
        </Column>
      ).toArray()
    }
  </div>;

export { Grid };
