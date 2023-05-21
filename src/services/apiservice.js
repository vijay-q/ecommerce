import React from "react";

import axios from 'axios';

export const getCategoryApi = () => {    
    var options = {
    url: 'https://elredtest.s3.amazonaws.com/reactAssignment/getCategories.json',
    method: 'GET',
      headers: {
      }
    };
    return axios(options)
}

export const getSubCategoryApi = (subid) => {    
    var options = {
    url: `https://elredtest.s3.amazonaws.com/reactAssignment/getSubCategory_${subid}.json`,
    method: 'GET',
      headers: {
      }
    };
    return axios(options)
}

export const getProductsApi = (subid) => {    
    var options = {
    url: `https://elredtest.s3.amazonaws.com/reactAssignment/getProduct_${subid}.json`,
    method: 'GET',
      headers: {
      }
    };
    return axios(options)
}
