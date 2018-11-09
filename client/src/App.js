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
        query: 'name'
    },
    {
        label: 'Size',
        query: 'size'
    },
    {
        label: 'Upload date',
        query: 'date'
    }
]

class App extends Component {
    state = {
        tab: 0,
        sortBy: sortBy[2].label,
        images: [],
        search: '',
        loading: false,
        page: 0,
        dynamicLoading: false,
        sort: 'date'
    }
    getImages = this.getImages.bind(this)

    async componentDidMount() {
        this.getImages(0)
    }

    async getImages(page) {
        this.setState({ loading: true })
        let url = '/api?start=' + page + '&sort=' + this.state.sort + '&search=' + this.state.search
        try {
            let response = await fetch(url, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
            if (response.ok) {
                let responseJson = await response.json()
                for (let image of responseJson.images)
                    if (image.name.length > 20) image.name = image.name.slice(0, 20) + '...'

                let images = this.state.images
                if (page > this.state.page) images = images.concat(responseJson.images)
                else {
                    images = responseJson.images.slice()
                    this.setState({ page })
                }
                this.setState({ images })
            }
            this.setState({ loading: false })
        } catch (err) {
            console.log(err.message)
            this.setState({ loading: false })
        }
    }

    onSort(event) {
        this.setState({
            [event.target.name]: event.target.value,
            sort: sortBy.find(elm => elm.label === event.target.value).query
        }, () => this.getImages(0))
    }

    async onLoadMore() {
        let page = this.state.page
        let prevCount = this.state.images.length
        await this.getImages(page + 1)
        let currCount = this.state.images.length
        if (prevCount !== currCount) this.setState({ page: page + 1 })
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <div className='app-body'>
                    <Paper style={{ padding: 10, paddingTop: 0, marginBottom: 20, marginTop: 20, width: '75%' }}>
                        <div style={{ marginTop: 10, marginBottom: 10, textAlign: 'left' }}>
                            <Upload updateData={this.getImages} />
                            <Divider style={{ marginTop: 10 }} />
                        </div>
                        <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '70%' }}>
                            <TextField
                                variant='outlined'
                                label='Find image...'
                                style={{ width: '65%' }}
                                onChange={e => this.setState({ search: e.target.value })}
                            />
                            <Button
                                variant='outlined'
                                color='secondary'
                                style={{ width: '10%' }}
                                onClick={() => this.getImages(0, this.state.search)}
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
                        {this.state.loading && <CircularProgress color='secondary' style={{ marginBottom: 10 }} />}
                        {this.state.images.length > 0 &&
                            <div>
                                <ImageList images={this.state.images} />
                                {this.state.dynamicLoading ?
                                    <CircularProgress color='secondary' size={20} style={{ marginTop: 10 }} />
                                    :
                                    <Button variant='outlined' style={{ marginTop: 10 }} onClick={() => this.onLoadMore()}>Load more</Button>
                                }
                            </div>
                        }
                    </Paper>
                </div>
            </div>
        )
    }
}

export default App
