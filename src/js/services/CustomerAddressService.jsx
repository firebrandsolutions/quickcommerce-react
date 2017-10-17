import axios from 'axios'
//import request from 'reqwest' // TODO: Use axios
//import when from 'when'

import CustomerConstants from '../constants/CustomerConstants.jsx'
import CustomerActions from '../actions/CustomerActions.jsx'

class CustomerAddressService {
    onSuccess(response) {        
        if (response.hasOwnProperty('data') && response.data.hasOwnProperty('data')) {            
            //var model = new Entity()
            //that.setData(response.data, model)
            let data = response.data['data']
            CustomerActions.setCustomer(data)
        } else if (response.hasOwnProperty('data')) {
            // Check to see if user is already logged?
            if (response.data.success === false) {
                this.handleApiError(response)
            }
        }
    }
    
    processResponse(onSuccess, onError) {
        //customerModule.clearCustomer()
        if (response.status === 200 && response.data.success === true) {
            let payload = (response.data.hasOwnProperty('data')) ? response.data.data : {}
            // Get address from returned array of addresses by ID
            let addressId = (payload.hasOwnProperty('address_id')) ? payload.address_id : false
            let addresses = (payload.hasOwnProperty('addresses') && payload.addresses instanceof Array) ? payload.addresses : []
            
            if (addressId !== false && addresses.length > 0) {
                // Get the address
                let idx = 0
                let address = null
                for (idx = 0; idx < addresses.length; idx++) {
                    address = addresses[idx]
                    // Ensure proper type conversion (ids are returned as strings) and compare
                    if (parseInt(address['address_id']) === parseInt(addressId)) {
                        break
                    }
                }
                
                if (address !== null) {
                    // We have the address, set it to state
                    this.setState({
                        addresses: payload.addresses,
                        billingAddressId: addressId,
                        billingAddress: address
                    })
                }
            }
        }
    }
    
    get(data, onSuccess, onError) {
        var that = this,
			customer
		
		if (sessionId) {
			customer = dataSources.get('customer.entity') || null
			if (customer instanceof kendo.data.Model) {
				if (customer.get('session') === sessionId) {
					return customer
				}
			}
		} else {
			return false
		}
		
		// Get the account
		axios({
			url: QC_LEGACY_API + 'account/address',
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			async: false
		}).then(response => {
            if (response.success) {
                if (response.hasOwnProperty('data')) {
                    // We can specify a target observable as the second param
                    //console.log('calling setData... set response data to customer model - ' + new Date())
                    //that.setData(response.data, model)
                    
                    // TODO: Better please... events maybe?
                    console.log('set customer data - ' + new Date())
                    //that.setCustomer(model)   
                }
            } else {
                //loader.close()
            }
        })
    }
    
    post(data, onSuccess, onError) {
        // Register user
        axios({
            url: QC_LEGACY_API + 'account/address',
            data: JSON.stringify(data),
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            async: false, // No async login
        }).then(response => {
            if (response.success) {
                if (response.hasOwnProperty('data')) {
                    axios({
                        url: QC_LEGACY_API + 'account/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: 'application/json'
                    }).then(response => {
                        // We can specify a target observable as the second param
                        //block.setData(response.data, model)
                        //dataSources.set('customer.entity', model)
                        
                        //var customerModule = page.getModule('module_customer_1')
                        //customerModule.setCustomer(model)
                    })
                }
            } else {
                // Do something
            }
        }).catch({
            // Do something
        })
        
    }
    
    put(data, onSuccess, onError) {
        var that = this,
			filterData = false,
			data,
			response,
			url
		
		console.log('SEND TO SERVER')
		console.log(data)
        
		// Update user
		axios({
			//url: QC_LEGACY_API + 'account/address',
			url: QC_LEGACY_API + 'account/address/' + data['address_id'], // TODO: Legacy API uses different semantics
			data: JSON.stringify(data),
			method: 'PUT',
			dataType: 'json',
			contentType: 'application/json',
			async: true // No async login
		}).then(response => {
            if (response.success) {
                if (response.hasOwnProperty('data')) {
                    //loader.setMessage('Success! Your information has been updated').open()
                }
            } else {
                // Do something
            }
        })
    }
    
    patch(data, onSuccess, onError) {
        
    }
    
    delete(data, onSuccess, onError) {
        
    }
    
    setAddresses() {
		this.fetchBillingAddress()
		this.fetchShippingAddress()
    }
    
    handleApiError(response) {
        // Do something
    }
    
    /**
     * Legacy API
     */
    fetchBillingAddress(onSuccess) {
		axios({
			url: QC_LEGACY_API + 'paymentaddress',
			type: 'GET',
			//async: false,
			//dataType: 'json',
			//data: JSON.stringify({
			//	address_id: 1,
			//	payment_address: 'existing'
			//})
		})
        .then(response => {
            //customerModule.clearCustomer()
            if (response.status === 200 && response.data.success === true) {
                let payload = (response.data.hasOwnProperty('data')) ? response.data.data : {}
                // Get address from returned array of addresses by ID
                let addressId = (payload.hasOwnProperty('address_id')) ? payload.address_id : false
                let addresses = (payload.hasOwnProperty('addresses') && payload.addresses instanceof Array) ? payload.addresses : []
                
                if (addressId !== false && addresses.length > 0) {
                    // Get the address
                    let idx = 0
                    let address = null
                    for (idx = 0; idx < addresses.length; idx++) {
                        address = addresses[idx]
                        // Ensure proper type conversion (ids are returned as strings) and compare
                        if (parseInt(address['address_id']) === parseInt(addressId)) {
                            break
                        }
                    }
                    
                    if (address !== null) {
                        // We have the address, set it to state
                        CustomerActions.setBillingAddress({
                            addresses: payload.addresses,
                            billingAddressId: addressId,
                            billingAddress: address
                        })
                    }
                }
            }
        }).catch(err => {
            console.log(err)
        })
	}
    
    /**
     * Legacy API
     */
    fetchShippingAddress(onSuccess) {
		axios({
			url: QC_LEGACY_API + 'shippingaddress',
			type: 'GET',
			//data: JSON.stringify({
			//	address_id: 1,
			//	shipping_address: 'existing'
			//})
		})
        .then(response => {
            //customerModule.clearCustomer()
            if (response.status === 200 && response.data.success === true) {
                let payload = (response.data.hasOwnProperty('data')) ? response.data.data : {}
                // Get address from returned array of addresses by ID
                let addressId = (payload.hasOwnProperty('address_id')) ? payload.address_id : false
                let addresses = (payload.hasOwnProperty('addresses') && payload.addresses instanceof Array) ? payload.addresses : []
                
                if (addressId !== false && addresses.length > 0) {
                    // Get the address
                    let idx = 0
                    let address = null
                    for (idx = 0; idx < addresses.length; idx++) {
                        address = addresses[idx]
                        // Ensure proper type conversion (ids are returned as strings) and compare
                        if (parseInt(address['address_id']) === parseInt(addressId)) {
                            break
                        }
                    }
                    
                    if (address !== null) {
                        // We have the address, set it to state
                        CustomerActions.setShippingAddress({
                            addresses: payload.addresses,
                            shippingAddressId: addressId,
                            shippingAddress: address
                        })
                    }
                }
            }
        }).catch(err => {
            console.log(err)
        })
	}
}

export default new CustomerAddressService()