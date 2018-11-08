import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

export default class Upload extends Component {
    state = {
        url: ''
    }

    onSubmit() {
        console.log(this.state.url)
    }

    render() {
        return (
            <div>
                <TextField
                    variant='outlined'
                    label='Image url...'
                    style={{ width: '100%', marginBottom: 10 }}
                    onChange={e => this.setState({ url: e.target.value })}
                />
                <Button variant='outlined' color='secondary' onClick={() => this.onSubmit()}>Upload</Button>
            </div>
        )
    }
}