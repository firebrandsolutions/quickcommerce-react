import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

import CartDragItem from '../cart/CartMenuDragItem.jsx'

export default class TextMenuEntryRow1x extends Component {
    static defaultProps = {
        data : {}, 
        onItemClicked: () => {},
        onAddToCartClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        console.log('rendering product row')
        console.log('props.data')
        console.log(this.props.data)
        return (
            <Col xs={12} sm={12}>
                <CartDragItem
                    onItemClicked = {this.props.onItemClicked}
                    displayLabel = {false}
                    displayThumbnail = {false}
                    item = {this.props.data}
                    id = {this.props.data.id}>
                    <Button block onClick={this.props.onAddToCartClicked}><i className='fa fa-shopping-cart' /> Quick Add</Button>
                </CartDragItem>
            </Col>
        )
    }
}