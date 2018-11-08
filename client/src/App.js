import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import CircularProgress from '@material-ui/core/CircularProgress'
import Upload from './Upload'
import ImageList from './ImageList'
import './stylesheets/App.css'

const sortBy = [
    {
        label: 'Name',
        sort: (images) => [...images].sort((a, b) => a.name.localeCompare(b.name))
    },
    {
        label: 'Size'
    },
    {
        label: 'Upload date'
    }
]

class App extends Component {
    state = {
        tab: 0,
        sortBy: sortBy[2].label,
        images: null,
        find: '',
        loading: false
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            let response = await fetch('/api', {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
            if (response.ok) {
                let responseJson = await response.json()
                let images = responseJson.images.slice()
                for (let image of images) {
                    if (image.name.length > 20) image.name = image.name.slice(0, 20) + '...'
                    // image.src = atob(image.src)
                }
                console.log(images)
                this.setState({ images: responseJson.images })
            }
            this.setState({ loading: false })
        } catch (err) {
            console.log(err.message)
            this.setState({ loading: false })
        }
    }

    onSort(event) {
        this.setState({ [event.target.name]: event.target.value })
        console.log(sortBy.find(elm => elm.label === event.target.value).sort(this.state.images))
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <div className='app-body'>
                    <Paper style={{ padding: 10, paddingTop: 0, marginBottom: 20, marginTop: 20, width: '75%' }}>
                        <div style={{ marginTop: 10, marginBottom: 10, textAlign: 'left' }}>
                            <Upload />
                            <Divider style={{ marginTop: 10 }} />
                        </div>
                        <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '70%' }}>
                            <TextField
                                variant='outlined'
                                label='Find image...'
                                style={{ width: '65%' }}
                                onChange={e => this.setState({ find: e.target.value })}
                            />
                            <Button
                                variant='outlined'
                                color='secondary'
                                style={{ width: '10%' }}
                                onClick={() => console.log(this.state.find)}
                            >
                                Find
                            </Button>
                            <FormControl style={{ width: '20%' }}>
                                <InputLabel htmlFor="age-simple">Sort by</InputLabel>
                                <Select
                                    value={this.state.sortBy}
                                    onChange={event => this.onSort(event)}
                                    inputProps={{
                                        name: 'sortBy',
                                    }}
                                >
                                    {sortBy.map(elm =>
                                        <MenuItem key={elm.label} value={elm.label}>{elm.label}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        {this.state.loading ?
                            <CircularProgress color='secondary' />
                            :
                            (this.state.images && this.state.images.length > 0) &&
                            <div>
                                <ImageList images={this.state.images} />
                                {/* {this.state.images.map(image => 
                                    <img src={image.src} />
                                )} */}
                                <Button variant='outlined' style={{ marginTop: 10 }}>Load more</Button>
                            </div>
                        }
                    </Paper>
                </div>
            </div>
        )
    }
}

export default App
