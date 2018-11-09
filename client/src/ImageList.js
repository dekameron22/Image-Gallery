import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Image from './Image'

export default class ImageList extends Component {
    render() {
        return (
            <div>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={Number(24)}>
                        {this.props.images.map(value => (
                            <Grid key={value.id} item>
                                <Image src={value.src} name={value.name} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </div>
        )
    }
}