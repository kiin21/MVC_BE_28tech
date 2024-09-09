const Product = require("../../models/product.model");
const filterBarHelper = require("../../helpers/filter");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [get] admin/products
module.exports.products = async (req, res) => {
    let query = req.query;

    //search
    let filter = { deleted: false };

    if (query.status) {
        filter.status = query.status;
    }

    let searchObj = searchHelper(query);

    if (searchObj.regex) {
        filter.title = searchObj.regex;
    }
    //filter
    let filterStatus = filterBarHelper(query);

    //pagination
    let numberOfProducts = await Product.countDocuments(filter);
    let paginationObj = await paginationHelper(
        query,
        numberOfProducts, {
        limitItems: 5,
        currentPage: 1,
    });

    //Retrieve products
    let products = await Product.find(filter)
        .sort({ position: 'asc' })
        .limit(paginationObj.limitItems)
        .skip((paginationObj.currentPage - 1) * paginationObj.limitItems);

    res.render("admin/pages/products/index", {
        products: products,
        filterBar: filterStatus,
        keyword: searchObj.keyword,
        paginationObj: paginationObj
    });
}

// [patch] admin/products/change-status/:status/:ID
module.exports.changeStatus = async (req, res) => {
    let status = req.params.status;
    let ID = req.params.ID;

    await Product.updateOne({ _id: ID }, { status: status });

    req.flash('success', 'Change status successfully');

    res.redirect('back');
}

// [patch] admin/products/changes-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    let IDs = req.body.IDs.split(', ');
    let status = req.body.status;


    switch (status) {
        case 'available':
            await Product.updateMany({ _id: { $in: IDs } }, { status: 'available' });
            req.flash('success', `Change status of ${IDs.length} successfully`);
            break;
        case 'unavailable':
            await Product.updateMany({ _id: { $in: IDs } }, { status: 'unavailable' });
            req.flash('success', `Change status of ${IDs.length} product(s) successfully`);
            break;
        case 'delete-all':
            await Product.updateMany({ _id: { $in: IDs } }, { deleted: true });
            req.flash('success', `Delete successfully`);
            break;
        case 'change-position':
            for (const product of IDs) {
                let [id, position] = product.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            break;
        default:
            break;
    }

    res.redirect('back');
}


// [delete] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    let id = req.params.id;
    let currentTime = new Date();

    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: currentTime
        });

    res.redirect('back');
}

// // [get] admin/products/configdb
// module.exports.configDB = async (req, res) => {
//     let products = await Product.find();

//     // add position/index for each product
//     for (let i = 0; i < products.length; i++) {
//         await Product.updateOne({ _id: products[i]._id }, { position: i + 1 });
//     }

//     res.redirect('back');
// }