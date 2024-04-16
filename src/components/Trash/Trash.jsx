import React from 'react'
import { Helmet } from 'react-helmet'
import ProductsTrash from '../ProductsTrash/ProductsTrash'
import VariantTrash from '../VariantTrash/VariantTrash'

export default function Trash() {
  return <>
    <Helmet>
      <title>Trash</title>
    </Helmet>
    <ProductsTrash/>
    <VariantTrash/>
    </>
}
