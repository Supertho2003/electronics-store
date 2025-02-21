import React from 'react'
import Header from '../Header'
import Category from '../Category'
import Product from '../Product'
import Footer from '../Footer'
import Hero from '../Hero'


const HomePage = () => {
  return (
    <div className='relative h-full w-[100%]'>
      <Header/>
      <Hero/>
      <Category/>
      <Product/>
      <Footer/>
    </div>
  )
}

export default HomePage
