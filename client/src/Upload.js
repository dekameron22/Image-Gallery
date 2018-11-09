import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

export default class Upload extends Component {
    state = {
        uri: '',
        loading: false
    }

    async onUpload() {
        if (!this.state.uri) return
        this.setState({ loading: true })
        let response = await fetch('/api', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                uri: this.state.uri
            })
        })
        if (response.ok) {
            this.props.updateData(this.props.page)
        }
        this.setState({ loading: false })
    }

    render() {
        return (
            <div>
                <TextField
                    variant='outlined'
                    label='Image url...'
                    style={{ width: '100%', marginBottom: 10 }}
                    onChange={e => this.setState({ uri: e.target.value })}
                />
                {this.state.loading ?
                    <CircularProgress color='secondary' />
                    :
                    <Button variant='outlined' color='secondary' onClick={() => this.onUpload()}>Upload</Button>
                }
            </div>
        )
    }
}