const express= require('express');
const cors=require('cors');
const axios=require('axios');

const app= express();
const port=3003;
const db=require('./database');
const server=app.listen(port, ()=>{console.log('Server listen on port : '+port)});
const functions=require('./functions');
app.get('/', (req,res)=>{
    return res.json({
        status:'success',
        message:'Server is running properly:)'
    })
});
app.get('/products',(req,res)=>{
    const limit = req.query.limit;
    const offset = req.query.offset;
    const cat = req.query.cat;
    const brand = req.query.brand;
    console.log('cat '+ cat +' brand' + brand);
    if(cat==0 && brand==0){
        var sql=`SELECT * FROM product_tbl where fld_archive_product='no' order by fld_product_id ASC limit ${limit} offset ${offset}`;
        db.query(sql,(err,data)=>{
            if(err){
              //  console.log('no filter err', sql);
                return res.json({status:0,message:err,products:[]})
            }else{
             //   console.log('no filter');
                    return res.json({status:1,message:'Your Products',products:data})
            }
        })
    }else if(cat!=0 && brand==0){
        var sql=`SELECT * FROM product_tbl where fld_category_id=${cat} and fld_archive_product='no' order by fld_product_id ASC limit ${limit} offset ${offset}`;
        db.query(sql,(err,data)=>{
            if(err){
              //  console.log('1 filter err', sql);
                return res.json({status:0,message:err,products:[]})
            }else{
              //  console.log('only cat filter');
                    return res.json({status:1,message:'Your Products',products:data})
            }
        }) 
    }else{
        var sql=`SELECT * FROM product_tbl where fld_category_id=${cat} and fld_brand_id=${brand} and fld_archive_product='no' order by fld_product_id ASC limit ${limit} offset ${offset}`;
        db.query(sql,(err,data)=>{
            if(err){
              //  console.log('both filter err', sql);
                return res.json({status:0,message:err,products:[]})
            }else{
              //  console.log('both filter');
                    return res.json({status:1,message:'Your Products',products:data})
            }
        })  
    }
});
app.get('/productsById/:id',(req,res)=>{
    const id = req.params.id;
    let sql=`SELECT * FROM product_tbl where fld_product_id=${id}`;
    db.query(sql,async(err,data)=>{
        if(err){
            return res.json({status:0,message:err,product:null})
        }else{
            if(data.length==0){
                return res.json({status:2,message:'No Products',product:null})
            }else{
                var categoryName=await functions.getCategoryById(data[0].fld_category_id);
                var brandName=await functions.getBrandById(data[0].fld_brand_id);
                return res.json({status:1,message:'Your Product',product:data[0],category:categoryName,brnad:brandName})
            }
        }
    })
   
});
app.get('/productsVarinatById/:id',(req,res)=>{
    const id = req.params.id;
    // let sql=`SELECT v.*,(SELECT fld_color_name FROM color_tbl c WHERE c.fld_color_id=v.fld_color) As ColorName,(SELECT fld_color_code FROM color_tbl c WHERE c.fld_color_id=v.fld_color) As ColorCode FROM product_variant_tbl v WHERE fld_product_id=${id}`;
    let sql=`SELECT * FROM product_variant_tbl where fld_product_id=${id}`;
    db.query(sql,async(err,data)=>{
        if(err){
            return res.json({status:0,message:err,variant:[]})
        }else{
            if(data.length==0){
                return res.json({status:2,message:'No variant',variant:[]})
            }else{
                let vars=data;
                const myVars=[];
                for(let i=0; i<data.length;i++){
                    let colorName='';
                    if(data[i]['fld_color']!=null){
                         colorName= await functions.getColorById(data[i]['fld_color']);
                    }else{
                         colorName='';
                    }
                    var temp={
                        'id':data[i]['fld_variant_id'],
                        'sku':data[i]['fld_variant_sku'],
                        'price':data[i]['fld_variant_price'],
                        'discount_type':data[i]['fld_variant_discount_type'],
                        'discount_amount':data[i]['fld_variant_discount'],
                        'quantity':data[i]['fld_quantity'],
                        'sizeId':data[i]['fld_size'],
                        'weightId':data[i]['fld_weight'],
                        'colorId':data[i]['fld_color'],
                        'materialId':data[i]['fld_material'],
                        'flavourId':data[i]['fld_flavour'],
                        'capacityId':data[i]['fld_capacity'],
                        'configrationId':data[i]['fld_configration'],
                        'sizeName':'',
                        'weightName':'',
                        'colorName':colorName,
                        'materialName':'',
                        'flavourName':'',
                        'capacityName':'',
                        'configrationName':''
                    }
                    myVars.push(temp);
                }
                return res.json({status:1,message:'Your variants',variant:myVars})
            }
        }
    })
   
});
app.get('/banners',(req,res)=>{
    let sql=`SELECT * FROM banner_tbl where fld_banner_status='1' order by fld_banner_serial ASC`;
    db.query(sql,(err,data)=>{
        if(err){
            return res.json({status:0,message:err,banners:null})
        }else{
            if(data.length==0){
                return res.json({status:2,message:'No Banner',banners:null})
            }else{
                return res.json({status:1,message:'Your Banners',banners:data})
            }
        }
    })
});
app.get('/homedata',async(req,res)=>{
   let banners=await functions.getBanners();
   let category=await functions.getCategories();
   let product=await functions.getProducts();
    res.json({
        status:1,
        message:'Home Data',
        banners:banners,
        category:category,
        product:product
    })
});
app.get('/categories',async(req,res)=>{
    let category=await functions.getCategories();
     res.json({
         status:1,
         message:'Category Data',
         category:category
     })
 });
 app.get('/brands/:id',async(req,res)=>{
    const id = req.params.id;
    let brands=await functions.getBrands(id);
     res.json({
         status:1,
         message:'brands Data',
         brand:brands
     })
 });
 app.get('/generateToken',async(req,res)=>{
    var token=functions.generateUniqueAlphanumeric(20);
    if(!functions.checkIsTokenExist(token)){
        console.log('token found');
        token=functions.generateUniqueAlphanumeric(20);
    }else{
        let sql=`INSERT INTO user_track_token_tbl(fld_token) VALUES ('${token}')`;
        db.query(sql,(err,data)=>{});
    }
    return res.json({status:1,token:token});
 });
 app.get('/getCartCount/:token',async(req,res)=>{
    const token = req.params.token;
    let sql=`SELECT * FROM cart_tbl where fld_user_code='${token}'`;
    db.query(sql,(err,data)=>{
        if(err){
            res.json({status:1,cartCount:0})
        }else{
            res.json({status:1,cartCount:data.length});
        }
    });
 });
 app.post('/addToCart',(req,res)=>{
    
 })
// app.get('/getBrandFromWeb',(req,res)=>{
//     let config={
//         method:'get',
//         url:'https://dummyjson.com/products?skip=0&limit=100',
//         headers: { }
//     };
//     axios.request(config)
//     .then(async(response)=>{
//         const products=response.data.products;
//         for (let index = 0; index < products.length; index++) {
//             const product = products[index];
//             let brand=product.brand;
//             let catslug=product.category;
//             let brandSlug=brand.replace(/ /g, "-");  
//             brandSlug=brandSlug.toLowerCase();
//             let categoryId= await functions.getCategoryIdBySlug(catslug);
//             if(categoryId==0){
//                 continue
//             }else{
//                 let isBrand=await functions.isBrandExist(brandSlug);
//                 if(!isBrand){
//                     let sql="INSERT INTO `brand_tbl`( `fld_category_id`,`fld_brand_name`, `fld_brand_slug`, `fld_title`, `fld_keywords`, `fld_description`, `fld_status`) VALUES ("+categoryId+",'"+brand+"','"+brandSlug+"','"+brand+"','"+brand+"','"+brand+"','active')";
//                     db.query(sql, async (err,data)=>{
//                        if(err){
//                        console.log('error ',err);
//                     }else{
//                         console.log('inserted ',data);
//                     }
//                     });
//                     console.log('index if part');
//                 }else{
//                     console.log('index else part');
//                 }
//             }
//         }

//         return res.json(response.data.products);
//     })
//     .catch((error)=>{
//         return res.json(error);
//     })
// });
// app.get('/getProductFromWeb',(req,res)=>{
//     let config={
//         method:'get',
//         url:'https://dummyjson.com/products?skip=0&limit=100',
//         headers: { }
//     };
//     axios.request(config)
//     .then(async(response)=>{
//         const products=response.data.products;
//         for (let index = 0; index < products.length; index++) {
//             const product = products[index];
//             let productName=product.title;
//             let proSlug=productName.replace(/ /g, "-");  
//             proSlug=proSlug.toLowerCase();
//             let categorySlug=product.category;
//             let categoryId= await functions.getCategoryIdBySlug(categorySlug);
//             let brand=product.brand;
//             let brandSlug=brand.replace(/ /g, "-");  
//             brandSlug=brandSlug.toLowerCase();
//             let brandId= await functions.getBrandBySlug(brandSlug);
//             let proImages=JSON.stringify(product.images);
//            if(categoryId==0 || brandId==0){
//             console.log('category id or brand id is invalid');
//            }else{
//             console.log('index - '+ index + ' category - '+ categoryId + ' brand - '+ brandId);
//             let sql1=`INSERT INTO product_tbl(fld_category_id, fld_brand_id, fld_product_name, fld_product_slug, fld_product_type, fld_product_price, fld_product_discount_type, fld_product_discount, fld_product_thumb, fld_product_images, fld_product_brief,fld_product_details, fld_title, fld_keywords, fld_description, fld_rating) VALUES (${categoryId},${brandId},'${productName}','${proSlug}','variant','${product.price}','percent','${product.discountPercentage}','${product.thumbnail}','${proImages}','${product.description}','${product.description}','${productName}','${productName}','${product.description}',${product.rating})`;
//             db.query(sql1, async (err,data)=>{
//                 if(err){
//                 console.log('error in product insert ',err);
//              }else{
//                 console.log('product inserted ');
//                  let insertedId=data.insertId;
//                  let skuCode=proSlug+insertedId;
//                  let sql2=`INSERT INTO product_variant_tbl(fld_product_id, fld_variant_sku, fld_variant_price,fld_variant_discount_type,fld_variant_discount,fld_quantity) VALUES (${insertedId},'${skuCode}','${product.price}','percent','${product.discountPercentage}',${product.stock})`;
                
//                  db.query(sql2, async (err,data)=>{
//                     if(err){
//                     console.log('error in product variant insert ',err);
//                  }else{
//                     console.log('product variant inserted '); 
//                 }
//                  });
//             }
//              });
//            }
//         }

//         return res.json(response.data.products);
//     })
//     .catch((error)=>{
//         return res.json(error);
//     })
// });



