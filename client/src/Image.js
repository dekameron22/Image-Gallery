import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'

export default class Image extends Component {
    render() {
        return (
            <Paper style={{ height: 400, width: 500 }}>
                <img
                    src={this.props.src}
                    style={{ height: '80%', width: '95%', marginTop: 5 }}
                />
                <h3 style={{ margin: 0 }}>{this.props.name}</h3>
            </Paper>
        )
    }
}