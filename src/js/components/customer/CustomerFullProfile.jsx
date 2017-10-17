import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import CurrentAddress from '../address/CurrentAddress.jsx'
import ShippingAddress from '../address/ShippingAddress.jsx'
import CustomerInfo from '../customer/CustomerFullInfo.jsx'
import CustomerIdentity from '../customer/CustomerIdentity.jsx'

import Auth from '../../services/AuthService.jsx'
import AuthenticatedComponent from '../AuthenticatedComponent'

import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerService from '../../services/CustomerService.jsx'
import CustomerAddressService from '../../services/CustomerAddressService.jsx'

export default class CustomerFullProfile extends Component {
	static defaultProps = {
		pk: 'customer_id',
		editAccount: false,
		newAccount: true,
		displayLogin: false,
		displayProfile: true,
        displayPassword: true,
		displayCurrentAddress: false,
		displayShippingAddress: false,
        multipleAddresses: false,
		currentAddress: {},
		billingAddress: {},
		shippingAddress: {},
		customer: {
			id: null,
			customer_id: null,
			address_id: null,
			addresses: [],
			firstname: '',
			middlename: '',
			lastname: '',
			company_name: '',
			email: '',
			telephone: '',
			fax: ''
		}
	}
	
	constructor(props) {
        super(props)
        
        if (this.props.hasOwnProperty('billingAddress') || this.props.hasOwnProperty('currentAddress')) {
            // currentAddress and billingAddress are aliases
            if (!this.props.hasOwnProperty('currentAddress') && this.props.hasOwnProperty('billingAddress')) {
                console.log('has billing no current address')
                this.props.currentAddress = this.props.billingAddress
            }
            
            if (!this.props.hasOwnProperty('billingAddress') && this.props.hasOwnProperty('currentAddress')) {
                console.log('has current no billing address')
                this.props.billingAddress = this.props.currentAddress
            }
        }
        
        this.showNewAccountForm = this.showNewAccountForm.bind(this)
        this.hideNewAccountForm = this.hideNewAccountForm.bind(this)
        this.showEditAccountForm = this.showEditAccountForm.bind(this)
        this.hideEditAccountForm = this.hideEditAccountForm.bind(this)
        this.showLoginForm = this.showLoginForm.bind(this)
        this.hideLoginForm = this.hideLoginForm.bind(this)
        this.getForm = this.getForm.bind(this)
        
        this.onCreate = this.onCreate.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
        this.onSaveSuccess = this.onSaveSuccess.bind(this)
        this.onError = this.onError.bind(this)
        
        this.renderErrors = this.renderErrors.bind(this)
        
        this.state = {
            errors: {}
        }
    }
    
    componentWillReceiveProps(newProps) {
        if (this.props.hasOwnProperty('billingAddress') || this.props.hasOwnProperty('currentAddress')) {
            // currentAddress and billingAddress are aliases
            if (!this.props.hasOwnProperty('currentAddress') && this.props.hasOwnProperty('billingAddress')) {
                console.log('has billing no current address')
                this.props.currentAddress = this.props.billingAddress
            }
            
            if (!this.props.hasOwnProperty('billingAddress') && this.props.hasOwnProperty('currentAddress')) {
                console.log('has current no billing address')
                this.props.billingAddress = this.props.currentAddress
            }
        }
        
        //this.state = assign({}, this.props)
    }
    
    componentDidUpdate() {
        if (this.props.hasOwnProperty('billingAddress') || this.props.hasOwnProperty('currentAddress')) {
            // currentAddress and billingAddress are aliases
            if (!this.props.hasOwnProperty('currentAddress') && this.props.hasOwnProperty('billingAddress')) {
                console.log('has billing no current address')
                this.props.currentAddress = this.props.billingAddress
            }
            
            if (!this.props.hasOwnProperty('billingAddress') && this.props.hasOwnProperty('currentAddress')) {
                console.log('has current no billing address')
                this.props.billingAddress = this.props.currentAddress
            }
        }
    }
    
    showNewAccountForm() {
        this.hideLoginForm()
        this.setState({ createAccount: true })
    }
    
    hideNewAccountForm() {
        this.showLoginForm()
        this.setState({ createAccount: false })
    }
    
    showEditAccountForm() {
        this.hideLoginForm()
        this.setState({ editAccount: true })
    }
    
    hideEditAccountForm() {
        this.showLoginForm()
        this.setState({ editAccount: false })
    }
    
    showLoginForm() {
        this.setState({ showLogin: true })
    }
    
    hideLoginForm() {
        this.setState({ showLogin: false })
    }
    
    // TODO: Abstract out getForm and triggerAction
    getForm() {
        console.log('grabbing form data from child form components')
        console.log(this.profile.getForm())
        console.log(this.billingAddress.getForm())
        //console.log(this.shippingAddress.getForm())
        let formData = {
            profile: assign({}, this.profile.getForm()),
            //currentAddress: assign({}, this.currentAddress.getForm()),
            billingAddress: assign({}, this.billingAddress.getForm()),
            //shippingAddress: assign({}, this.shippingAddress.getForm()), 
            //mailingAddress: assign({}, this.mailingAddress.getForm()),
            addresses: [
                assign({}, this.billingAddress.getForm())
            ]
        }
        
        // Do something?
        return formData
    }
    
    triggerAction(callback) {
        return callback(this.getForm())
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            CustomerService.post(formData.profile, this.onCreateSuccess, this.onError)
        })
    }
    
    onUpdate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        this.triggerAction((formData) => {
            CustomerService.put(formData.profile, this.onSaveSuccess, this.onError)
            
            for (let idx = 0; idx < formData.addresses.length; idx++) {
                let address = formData.addresses[idx]
                let addressId = address['address_id'] || null
                
                // Drop in firstname and lastname fields to satisfy OC/Legacy API
                // If user wants to override names, he/she can do it on the order
                // Account addresses names should be hardcoded to match account profile
                address = assign(address, {
                    firstname: formData.profile['firstname'],
                    lastname: formData.profile['lastname']
                })
                
                if (addressId === null) {
                    CustomerAddressService.post(address)
                } else if (!isNaN(addressId)) {
                    CustomerAddressService.put(address)
                }
            }
        })
    }
    
    onCancel(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing onCancel')
        if (typeof this.props.onCancel === 'function') {
            console.log('execute handler')
            let fn = this.props.onCancel
            fn(e)
        }
    }
    
    onCreateSuccess(response) {
        console.log('executing onCreateSuccess')
        if (typeof this.props.onCreateSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onCreateSuccess
            fn(response)
        }
    }
    
    onSaveSuccess(response) {
        console.log('executing onSaveSuccess')
        if (typeof this.props.onSaveSuccess === 'function') {
            console.log('execute handler')
            let fn = this.props.onSaveSuccess
            fn(response)
        }
    }
    
    onError(response) {
        console.log('executing onError')
        if (typeof this.props.onError === 'function') {
            console.log('execute handler')
            let fn = this.props.onError
            fn(response)
        }
        
        this.setState({
            errors: response.error
        })
    }
    
    renderErrors() {
        let errors = []
        let count = Object.keys(this.state.errors).length
        let idx = 1
        
        if (typeof this.state.errors !== 'string' && count > 0) {
            for (let error in this.state.errors) {
                errors.push(<strong>{this.state.errors[error]}</strong>)
                if (idx < count) {
                    errors.push(<br/>)
                }
                
                idx++
            }
        } else if (typeof this.state.errors === 'string') {
            errors.push(<strong>{this.state.errors}</strong>)
        }
        
        return errors
    }

    render() {
        if (this.props.createAccount) {
            return (
                <Col sm={12} className='customer-profile display-block'>
                    {Object.keys(this.state.errors).length > 0 && (
                    <Alert bsStyle='danger' style={{
                        width: '75%',
                        textAlign: 'center',
                        margin: '0 auto'
                    }}>
                        {this.renderErrors()}
                    </Alert>
                    )}
                    
                    {/*
                    <div>
                        <NewAccountForm
                            onSaveSuccess = {this.hideNewAccountForm}
                            onCancel = {this.hideNewAccountForm}
                            />
                    </div>
                    */}
                    
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Information {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                                <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    
                    <div className='customer-profile-block row customer-info full-width-inputs'>
                        {this.props.children}
                        
                        {this.props.displayProfile && (
                        <CustomerInfo
                            ref = {(profile) => {this.profile = profile}}
                            onCancel = {this.onCancel}
                            onSaveSuccess = {this.onSaveSuccess}
                            displayPassword = {this.props.displayPassword}
                            mode = 'create'
                            />
                        )}
                    </div>
                    
                    {/* Customer Contacts */}
					<Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Contacts
                                <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Contact</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    {[0,1].map(idx => (
                    <Row className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerIdentity
                                        ref = {(identity) => {this.identity = identity}}
                                        //title = 'Contact & Identification'
                                        title = ''
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'create'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {/* Customer Identification */}
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Identification
                                <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Identification</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    {[0].map(idx => (
                    <Row className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerIdentity
                                        ref = {(identity) => {this.identity = identity}}
                                        //title = 'Contact & Identification'
                                        title = ''
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'create'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {/* Customer Addresses */}
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Addresses
                                {this.props.multipleAddresses && (
                                <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Address</h5></Button>
                                )}
                                
                                {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                                {!this.props.multipleAddresses && (
                                <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                                )}
                            </h4>
                        </Col>
                    </Row>
                    
                    {this.props.multipleAddresses && (
                    [0,1,2].map(idx => (
                    <Row className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    {/* TODO: Temporary hack so I can see several address types */}
                                    {idx  === 1 && (
                                    <CurrentAddress
                                        ref = {(address) => {this.billingAddress = address}}
                                        //title = ''
                                        modal = {this.props.modal}
                                        data = {this.props.billingAddress}
                                        durationRequired = {true}
                                        nameRequired = {false}
                                        mode = 'create'
                                        />
                                    )}
                                    
                                    {idx  !== 1 && (
                                    <CurrentAddress
                                        ref = {(address) => {this.billingAddress = address}}
                                        //title = ''
                                        modal = {this.props.modal}
                                        data = {this.props.billingAddress}
                                        durationRequired = {true}
                                        nameRequired = {false}
                                        mode = 'create'
                                        />
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))
                    )}

                    {/* If single / shipping / billing address */}
                    {!this.props.multipleAddresses && this.props.displayCurrentAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='billing-address'>
                            <CurrentAddress
                                ref = {(address) => {this.billingAddress = address}}
                                title = 'Current Address'
                                modal = {this.props.modal}
                                data = {this.props.billingAddress}
                                mode = 'create'
                                />
                        </div>
                    </div>
                    )}
                    
                    {/* If single / shipping / billing address */}
                    {!this.props.multipleAddresses && this.props.displayShippingAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='shipping-address'>
                            <CurrentAddress
                                ref = {(address) => {this.shippingAddress = address}}
                                title = 'Shipping Address'
                                modal = {this.props.modal}
                                data = {this.props.shippingAddress}
                                mode = 'create'
                                />
                        </div>
                    </div>
                    )}
                    
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <FormGroup>
                            <Button bsStyle='success' onClick={this.onCreate}><h4><i className='fa fa-check' /> Create Account</h4></Button>&nbsp;
                            <Button onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>&nbsp;
                        </FormGroup>
                    </div>
                </Col>
            )
        } else if (this.props.editAccount) {
            return (
                <Col sm={12} className='customer-profile display-block'>
                    {Object.keys(this.state.errors).length > 0 && (
                    <Alert bsStyle='danger' style={{
                        width: '75%',
                        textAlign: 'center',
                        margin: '0 auto'
                    }}>
                        {this.renderErrors()}
                    </Alert>
                    )}
                    
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Information {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                                <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    
                    <div className='customer-profile-block row customer-info full-width-inputs'>
                        {this.props.children}
                        
                        {this.props.displayProfile && (
                        <CustomerInfo
                            ref = {(profile) => {this.profile = profile}}
                            data = {this.props.customer}
                            onCancel = {this.props.onCancel}
                            onSaveSuccess = {this.props.onSaveSuccess}
                            displayPassword = {this.props.displayPassword}
                            mode = 'edit'
                            />
                        )}
                    </div>
                    
                    {/* Customer Contacts */}
					<Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Contacts
                                <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Contact</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    {[0,1].map(idx => (
                    <Row className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerIdentity
                                        ref = {(identity) => {this.identity = identity}}
                                        //title = 'Contact & Identification'
                                        title = ''
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'edit'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {/* Customer Identification */}
                    <Row>
                        <Col xs={12}>
                            <h4 className='section-heading' style={{textAlign: 'center'}}>
                                Customer Identification
                                <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Identification</h5></Button>
                            </h4>
                        </Col>
                    </Row>
                    {[0].map(idx => (
                    <Row className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    <CustomerIdentity
                                        ref = {(identity) => {this.identity = identity}}
                                        //title = 'Contact & Identification'
                                        title = ''
                                        onCancel = {this.onCancel}
                                        onSaveSuccess = {this.onSaveSuccess}
                                        //mode = 'edit'
                                        />
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))}
                    
                    {/* Customer Addresses */}
                    <h4 className='section-heading' style={{textAlign: 'center'}}>
                        Customer Addresses
                        {this.props.multipleAddresses && (
                        <Button className='repeater-button'><h5><i className='fa fa-plus-circle' /> Add Address</h5></Button>
                        )}
                        
                        {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
                        {!this.props.multipleAddresses && (
                        <Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
                        )}
                    </h4>
                    
                    {this.props.multipleAddresses && (
                    [0,1,2].map(idx => (
                    <Row className='repeater-row'>
                        <Col xs={1}>
                            <Button className='repeater-button' block><h5><i className='fa fa-minus-circle' /></h5></Button>
                        </Col>
                        <Col xs={10}>
                            <div className='customer-profile-block row full-width-inputs'>
                                <div className='billing-address'>
                                    {/* TODO: Temporary hack so I can see several address types */}
                                    {idx  === 1 && (
                                    <CurrentAddress
                                        ref = {(address) => {this.billingAddress = address}}
                                        //title = ''
                                        modal = {this.props.modal}
                                        data = {this.props.billingAddress}
                                        durationRequired = {true}
                                        nameRequired = {false}
                                        mode = 'edit'
                                        />
                                    )}
                                    
                                    {idx  !== 1 && (
                                    <CurrentAddress
                                        ref = {(address) => {this.billingAddress = address}}
                                        //title = ''
                                        modal = {this.props.modal}
                                        data = {this.props.billingAddress}
                                        durationRequired = {true}
                                        nameRequired = {false}
                                        mode = 'edit'
                                        />
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}><hr className='col-xs-12' style={{ maxWidth: '97%' }} /></Col>
                    </Row>
                    ))
                    )}
                    
                    {/* If single / shipping / billing address */}
                    {!this.props.multipleAddresses && this.props.displayCurrentAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='billing-address'>
                            <CurrentAddress
                                ref = {(address) => {this.billingAddress = address}}
                                title = 'Billing Address'
                                modal = {this.props.modal}
                                data = {this.props.billingAddress}
                                mode = 'edit'
                                />
                        </div>
                    </div>
                    )}
                    
                    {/* If single / shipping / billing address */}
                    {!this.props.multipleAddresses && this.props.displayShippingAddress && (
                    <div className='customer-profile-block row full-width-inputs'>
                        <div className='shipping-address'>
                            <CurrentAddress
                                ref = {(address) => {this.shippingAddress = address}}
                                title = 'Shipping Address'
                                modal = {this.props.modal}
                                data = {this.props.shippingAddress}
                                mode = 'edit'
                                />
                        </div>
                    </div>
                    )}
                    
                    <div className='customer-profile-block row full-width-inputs align-center'>
                        <FormGroup>
                            <Button bsStyle='success' onClick={this.onUpdate}><h4><i className='fa fa-check' /> Update Account</h4></Button>&nbsp;
                            <Button onClick={this.onCancel}><h4><i className='fa fa-ban' /> Cancel</h4></Button>&nbsp;
                        </FormGroup>
                    </div>
                    
                    {/*
                    <div>
                        <EditAccountForm
                            data = {this.props.customer}
                            onSaveSuccess = {this.hideEditAccountForm}
                            onCancel = {this.hideEditAccountForm}
                            />
                    </div>
                    */}
                </Col>
            )
        }
    }
}