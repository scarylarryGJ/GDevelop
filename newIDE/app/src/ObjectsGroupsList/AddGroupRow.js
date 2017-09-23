import React from 'react';
import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add';
import EmptyMessage from '../UI/EmptyMessage';

const styles = {
  message: {padding: 0},
}

// TODO: Factorize with AddObjectRow and the rows to add items in Project Manager?
export default class AddGroupRow extends React.Component {
  render() {
    const { style, onAdd, primaryText } = this.props;
    return (
      <ListItem
        style={style}
        primaryText={<EmptyMessage style={styles.message}>{primaryText}</EmptyMessage>}
        rightIconButton={
          <IconButton onClick={onAdd}>
            <Add />
          </IconButton>
        }
        onClick={onAdd}
      />
    );
  }
}
