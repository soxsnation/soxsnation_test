'use strict';

alia.defineService({
	name: 'inv',
	dependencies: ['$request']
}, function($request) {

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Private functions

	function resolveId(id) {
		var _id = alia.isObservable(id) ? id : Bacon.constant(id);
		var _loc = session.locate('astroid', 'dev');
		return _loc.combine(_id, function(loc, id) {
			return {
				loc: loc,
				id: id
			};
		});
	};

	function parseBody(res) {
		return res.body;
	}

	function parseMeta(res) {
		return {
			value: res.body,
			meta: {
				id: res.xhr.getResponseHeader('astroid-id'),
				revision: res.xhr.getResponseHeader('astroid-revision')
			}
		};
	};

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Service functions

	var inv = {};
	// var server = 'http://axon.dotdecimal.com/api/';
	// var server = 'http://axontest.dotdecimal.com/api/';
	var server = 'http://localhost:56902/api/';

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Item functions


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// getItems
	// partType of inventory gets all items otherwise only the specified item group is pulled
	//
	// status of order will only pull items that need to be ordered
	// status of raw will return raw materials
	// status of prepped will return prepped materials
	inv.getItems = function(partType, status, refresh) {
		console.log('inv.getItems()');
		return $request.get(server + 'Item', {}, {
			partType: partType,
			status: status,
			refresh: refresh
		}).then(parseBody);
	};

	inv.getItemByItemCode = function(itemCode) {
		console.log('inv.getItemByItemCode()');
		return $request.get(server + 'Item', {}, {
			itemcode: itemCode
		}).then(parseBody);
	};

	inv.getItemsByVendor = function(vendorCode, status) {
		console.log('inv.getItemsByVendor()');
		return $request.get(server + 'Item', {}, {
			vendor: vendorCode,
			status: status
		}).then(parseBody);
	};

	inv.getItemGroups = function(inventory) {
		console.log('inv.getItemGroups ');
		return $request.get(server + 'Item', {}, {
			group: inventory
		}).then(parseBody);
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Inventory Counts functions

	inv.getInventoryCountToVerify = function(countDate, countName) {
		console.log('inv.getInventoryCount()');
		return $request.get(server + 'InventoryCount', {}, {
			countDate: countDate,
			stage: 'verify',
			countName: countName
		}).then(parseBody);
	}

	inv.getInventoryCountToVerifyList = function(countDate) {
		console.log('inv.getInventoryCount()');
		return $request.get(server + 'InventoryCount', {}, {
			countDate: countDate,
			stage: 'verify',
			countName: 'list'
		}).then(parseBody);
	}

	inv.getInventoryCountToReview = function(countDate) {
		console.log('inv.getInventoryCountToReview()');
		return $request.get(server + 'InventoryCount', {}, {
			countDate: countDate,
			stage: 'review'
		}).then(parseBody);
	}

	inv.getInventoryCountDates = function() {
		console.log('inv.getInventoryCountDates()');
		return $request.get(server + 'InventoryCount', {}, {}).then(parseBody);
	}

	inv.insertInventoryCount = function(inventoryCount) {
		console.log('inv.insertPurchaseOrder');
		return $request.post(server + 'InventoryCount', inventoryCount).then(parseBody);
	}


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Document functions

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Purchase Order functions

	inv.getOpenPurchaseOrders = function() {
		console.log('inv.getOpenPurchaseOrders()');
		return $request.get(server + 'PurchaseOrder', {}, {}).then(parseBody);
	};

	inv.getPurchaseOrderById = function(docNum) {
		console.log('inv.getPurchaseOrderById()');
		return $request.get(server + 'PurchaseOrder/:id', {
			id: docNum
		}, {}).then(parseBody);
	};

	inv.insertPurchaseOrder = function(purchaseOrder, ctx) {
		console.log('inv.insertPurchaseOrder');
		return $request.post(server + 'PurchaseOrder', purchaseOrder).then(parseBody);
	}


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Goods Receipt functions

	inv.insertGoodsReceiptPO = function(goodsReceiptPO) {
		console.log('insertGoodsReceiptPO');
		console.log(goodsReceiptPO);
		return $request.post(server + 'GoodsReceiptPO', goodsReceiptPO);
	};

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Work Order functions

	inv.getWorkOrders = function() {
		console.log('inv.getWorkOrders');
		return $request.get(server + 'WorkOrder', {}, {}).then(parseBody);
	}

	inv.getWorkOrder = function(docNum) {
		console.log('getWorkOrder');
		return $request.get(server + 'WorkOrder/:id', {
			id: docNum
		}, {}).then(parseBody);
	}

	inv.insertWorkOrder = function(workOrder) {
		console.log('inv.insertWorkOrder');
		return $request.post(server + 'WorkOrder', workOrder).then(parseBody);
	}

	inv.insertCutdown = function(items) {
		console.log('inv.insertCutdown');
		return $request.post(server + 'Cutdown', items).then(parseBody);
	}


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Business Partnet functions

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Vendors functions

	inv.getVendors = function() {
		console.log('inv.getVendors()');
		return $request.get(server + 'BusinessPartner', {}, {
			type: 'vendor'
		}).then(parseBody);
	};

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Employee functions


	inv.getEmployees = function() {
		console.log('inv.getEmployees()');
		return $request.get(server + 'Employee', {}, {}).then(parseBody);
	};



	return inv;

});