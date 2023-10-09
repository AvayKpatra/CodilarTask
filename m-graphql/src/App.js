import React, { Component } from 'react';
import './App.scss'; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const apiUrl = '/graphql';
    const query = `
    {
      products(search: "", pageSize: 10) {
        items {
          id
          sku
          name
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          image { # Include the "image" field to retrieve the product image
            url
          }
          description {
            html
          }
          short_description {
            html
          }
        }
      }
    }
    
    `;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      mode: 'cors',

      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          this.setState({ error: data.errors[0].message, loading: false });
        } else {
          this.setState({ products: data.data.products.items, loading: false });
        }
      })
      .catch((error) => {
        this.setState({ error: 'Error fetching data from Magento: ' + error.message, loading: false });
      });
  }

  render() {
    const { products, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div className="container">
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <img src={product.image.url} alt={product.image.altText} />
            <p>{product.description.html}</p>
            <p>
              Price: {product.price.regularPrice.amount.value}{' '}
              {product.price.regularPrice.amount.currency}
            </p>
           
          </li>
        ))}
      </ul>
    </div>
    );
  }
}

export default App;
