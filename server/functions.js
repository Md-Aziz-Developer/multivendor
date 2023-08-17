const db = require('./database');
const crypto = require('crypto');
module.exports={
      getCategoryIdBySlug (catSlug) {
        return new Promise((resolve) => {
        let sql="SELECT * FROM `category_tbl` WHERE `fld_category_slug`='"+catSlug+"'";
         db.query(sql, async (err,data)=>{
            if(err){
                console.log("Err :: ", err);
                const result= 0;
                resolve(result);
            }else{
                
                    const result= data[0].fld_category_id;
                    resolve(result);
                
            }
        })
    });
    },
    getCategoryById (catId) {
        return new Promise((resolve) => {
        let sql="SELECT * FROM `category_tbl` WHERE `fld_category_id`='"+catId+"'";
         db.query(sql, async (err,data)=>{
            if(err){
                console.log("Err :: ", err);
                const result= 'Invalid Category';
                resolve(result);
            }else{
                const result= data[0].fld_category_name;
                resolve(result);
                
            }
        })
    });
    },
    getBrandById (brandId) {
        return new Promise((resolve) => {
            let sql="SELECT * FROM `brand_tbl` WHERE `fld_brand_id`='"+brandId+"'";
         db.query(sql, async (err,data)=>{
            if(err){
                console.log("Err :: ", err);
                const result= 'Invalid Brand';
                resolve(result);
            }else{
                const result= data[0].fld_brand_name;
                resolve(result);
                
            }
        })
    });
    },
    getColorById (colorId) {
        return new Promise((resolve) => {
            let sql="SELECT * FROM `color_tbl` WHERE `fld_color_id`='"+colorId+"'";
         db.query(sql, async (err,data)=>{
            if(err){
                console.log("Err :: ", err);
                const result= 'Invalid Color';
                resolve(result);
            }else{
                const result= data[0].fld_color_code;
                resolve(result);
                
            }
        })
    });
    },
    isBrandExist(brand){
        return new Promise((resolve) => {
            let sql="SELECT * FROM `brand_tbl` WHERE `fld_brand_slug`='"+brand+"'";
             db.query(sql, async (err,data)=>{
                if(err){
                    console.log("Err :: ", err);
                    const result= false;
                    resolve(result);
                }else{
                    if(data.length==0){
                        console.log('brand not exist');
                        const result=false;
                        resolve(result); 
                    }else{
                        console.log('brand already  exist');
                        const result = true;
                        resolve(result); 
                    }
                }
            })
        });
    },
    getBrandBySlug(brand){
        return new Promise((resolve) => {
            let sql=`SELECT * FROM brand_tbl WHERE fld_brand_slug="${brand}"`;
             db.query(sql, async (err,data)=>{
                if(err){
                    console.log("Err :: ", err);
                    const result= 0;
                    resolve(result);
                }else{
                    if(data.length==0){
                        const result=0;
                        resolve(result); 
                    }else{
                        const result= data[0].fld_brand_id;
                        resolve(result);
                    }
                }
            })
        });
    },
    getBanners(){
        return new Promise((resolve)=>{
            let sql=`SELECT * FROM banner_tbl where fld_banner_status='1' order by fld_banner_serial ASC`;
            db.query(sql,(err,data)=>{
                if(err){
                    const result=[];
                    resolve(result);
                }else{
                    const result=data;
                    resolve(result);
                }
            })
        })
    },
    getCategories(){
        return new Promise((resolve)=>{
            let sql=`SELECT * FROM category_tbl where fld_status='active' order by fld_category_name ASC`;
            db.query(sql,(err,data)=>{
                if(err){
                    const result=[];
                    resolve(result);
                }else{
                    const result=data;
                    resolve(result);
                }
            })
        })
    },
    getBrands(id){
        return new Promise((resolve)=>{
            if(id!='' && id!=0){
                let sql=`SELECT * FROM brand_tbl where fld_category_id=${id} and fld_status='active' order by fld_brand_name ASC`; 
                
                db.query(sql,(err,data)=>{
                    if(err){
                        const result=[];
                        resolve(result);
                    }else{
                        const result=data;
                        resolve(result);
                    }
                })
            }else{
                let sql=`SELECT * FROM brand_tbl where fld_status='active' order by fld_brand_name ASC`;  
                db.query(sql,(err,data)=>{
                    if(err){
                        const result=[];
                        resolve(result);
                    }else{
                        const result=data;
                        resolve(result);
                    }
                })
            }
            
        })
    },
    getProducts(){
        return new Promise((resolve)=>{
            let sql=`SELECT * FROM product_tbl where fld_archive_product='no' order by fld_time DESC limit 10`;
            db.query(sql,(err,data)=>{
                if(err){
                    const result=[];
                    resolve(result);
                }else{
                    const result=data;
                    resolve(result);
                }
            })
        })
    },
     generateUniqueAlphanumeric(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomBytes = crypto.randomBytes(length);
        const result = [];
      
        for (let i = 0; i < randomBytes.length; i++) {
          const index = randomBytes[i] % characters.length;
          result.push(characters[index]);
        }
        var token=result.join('');
        return token;
      },
      checkIsTokenExist(token){
        return new Promise((resolve)=>{
            let sql=`SELECT * FROM user_track_token_tbl where fld_token='${token}'`;
            db.query(sql,(err,data)=>{
                if(err){
                    const result=false;
                    resolve(result);
                }else{
                    if(data.length>0){
                        const result=false;
                    resolve(result);
                    }else{
                        const result=true;
                    resolve(result);
                    }
                }
            })
        });
      }
    
}
