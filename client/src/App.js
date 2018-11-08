import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Upload from './Upload'
import ImageList from './ImageList'
import './App.css'

const images = [
    {
        name: 'Babraca',
        src: 'https://cdn.pixabay.com/photo/2017/12/29/18/47/nature-3048299__340.jpg'
    },
    {
        name: 'Abraca',
        src: 'https://cdn.pixabay.com/photo/2017/12/29/18/47/nature-3048299__340.jpg'
    },
    {
        name: 'Dabraca',
        src: 'https://cdn.pixabay.com/photo/2017/12/29/18/47/nature-3048299__340.jpg'
    },
    {
        name: 'Cabraca',
        src: 'https://cdn.pixabay.com/photo/2017/12/29/18/47/nature-3048299__340.jpg'
    }
]

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
        images: images,
        find: ''
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
                                label='Find picrute...'
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
                        <ImageList images={this.state.images} />
                        <Button variant='outlined' style={{ marginTop: 10 }}>Load more</Button>
                    </Paper>
                </div>
            </div>
        )
    }
}

export default App
