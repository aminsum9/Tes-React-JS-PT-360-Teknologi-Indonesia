import React from 'react';
import './App.css';
import Modal from 'react-modal';

function App() {
  var [products, setProduct] = React.useState([]);

  const [modalAddProd, setModalAddProd] = React.useState(false);
  const [modalEditProd, setModalEditProd] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPage, setTotalPage] = React.useState(0);
  const [paging, setPaging] = React.useState(5);

  const [keyword, setKeyword] = React.useState('');
  const [tier, setTier] = React.useState('');
  const [category, setCategory] = React.useState('');

  // add product
  const [newName, setNewName] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('');

  const [newProductPrices, setNewProductPrices] = React.useState([
    {
      Unit: "",
      PriceDetails: [
        {
          Tier: "",
          Price: ""
        }
      ]
    }
  ]);

  const setNewProductPrice = (value, index) => {

    newProductPrices[index].Unit = value;

  }

  const setNewProductPriceDetailTier = (value, index, idx) => {
    newProductPrices[index].PriceDetails[idx].Tier = value;
  }

  const setNewProductPriceDetailPrice = (value, index, idx) => {
    newProductPrices[index].PriceDetails[idx].Price = value;
  }

  const addNewProductPrice = () => {
    setNewProductPrices([...newProductPrices, {
      Unit: "",
      PriceDetails: [
        {
          Tier: "",
          Price: ""
        }
      ]
    }]);
  }

  // edit product
  const [selectedEditProd, setSelectedEditProd] = React.useState({});
  const [editedName, setEditedName] = React.useState('');
  const [editedDesc, setEditedDesc] = React.useState('');
  const [editedCategory, setEditedCategory] = React.useState('');

  React.useEffect(() => {
    getProducts()
  }, [page, paging]);

  React.useEffect(() => {
    if (keyword == '' && tier == '' && category == '') {
      getProducts()
    }
  }, [page, keyword, tier, category]);

  const getProducts = () => {
    fetch(`http://0.0.0.0:8000/api/product?page=${page}&paging=${paging}&keyword=${keyword}&tier=${tier}&product_category=${category}`).then(ress => ress.json()).then((ress) => {
      if (ress.success) {
        setProduct(ress.data.data)
        setTotal(ress.data.total)
        setTotalPage(ress.data.total / paging)
      }
    })
  }

  const addProduct = () => {
    var formData = new FormData();

    formData.append('Name', newName)
    formData.append('Product_Category', newCategory)
    formData.append('Description', newDesc)

    for (let i = 0; i < newProductPrices.length; i++) {
      const element = newProductPrices[i];

      formData.append(`ProductPrices[${i}][Unit]`, element.Unit)

      for (let j = 0; j < element.PriceDetails.length; j++) {
        const ePriceDetail = element.PriceDetails[j];
        
        formData.append(`ProductPrices[${i}][PriceDetails][${j}][Tier]`, ePriceDetail.Tier)
        formData.append(`ProductPrices[${i}][PriceDetails][${j}][Price]`, ePriceDetail.Price)
      }
      
    }

    fetch(`http://0.0.0.0:8000/api/product/add`, {
      method: 'POST',
      body: formData
    }).then(ress => ress.json()).then((ress) => {
      if (ress.success) {
        // 
      }
    })
  }

  const updateProduct = () => {
    var formData = new FormData();

    formData.append('Id', selectedEditProd.Id)
    formData.append('Name', editedName)
    formData.append('Product_Category', editedCategory)
    formData.append('Description', editedDesc)

    fetch(`http://0.0.0.0:8000/api/product/update`, {
      method: 'POST',
      body: formData
    }).then(ress => ress.json()).then((ress) => {
      if (ress.success) {
        // 
      }
    })
  }


  const deleteProd = (Id) => {
    var formData = new FormData();

    console.log("id delete: ", Id)

    formData.append('Id', Id)

    fetch(`http://0.0.0.0:8000/api/product/delete`, {
      method: 'POST',
      body: formData
    }).then(ress => ress.json()).then((ress) => {
      if (ress.success) {
        // 
      }
    })
  }

  var arrayPages = [];

  for (let i = 0; i < totalPage; i++) {
    arrayPages.push('-');
  }

  return (
    <div className="App">
      <div>
        <div className='top-action'>
          <div className='search-box'>
            <input name="search-product"
              placeholder='Cari berdasarkan nama...'
              onChange={(val) => {
                setKeyword(val.target.value)
              }}
            ></input>
            <select value={tier} onChange={(val) => setTier(val.target.value)} name="Tier" className="select-box" >
              <option value="" >Pilih Tier</option>
              <option value="Non Member" >Non Member</option>
              <option value="Basic" >Basic</option>
              <option value="Premium" >Premium</option>
            </select>
            <select value={category} onChange={(val) => setCategory(val.target.value)} name="Product_Category" className="select-box" >
              <option value="" >Pilih Kategori</option>
              <option value="Rokok" >Rokok</option>
              <option value="Obat" >Obat</option>
              <option value="Lainnya" >Lainnya</option>
            </select>
            <select value={paging} onChange={(val) => setPaging(val.target.value)} name="Page" className="select-box" >
              <option value="5" >5</option>
              <option value="10" >10</option>
              <option value="15" >15</option>
              <option value="20" >20</option>
            </select>
            <button id="search-button" onClick={() => getProducts()}>cari</button>
            <button id="search-button" onClick={async () => {
              setKeyword('');
              setTier('');
              setCategory('');

            }}>reset</button>
          </div>
          <button className='button-add-product' onClick={() => setModalAddProd(true)} >Tambah Produk</button>
        </div>
      </div>
      <table>
        <thead>
          <th className='number-col'>No.</th>
          <th>Nama</th>
          <th>Kategori</th>
          <th>Deskripsi</th>
          <th>Aksi</th>
        </thead>
        <tbody>
          {products.map((item, index) => {
            var id = (index + 1) + ((page - 1) * paging);
            return (<tr>
              <td className='number-col' >{id}</td>
              <td>{item.Name}</td>
              <td>{item.Product_Category}</td>
              <td>{item.Description}</td>
              <td style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                <button onClick={() => {
                  setEditedName(item.Name)
                  setEditedCategory(item.Product_Category)
                  setEditedDesc(item.Description)
                  setSelectedEditProd(item)
                  setModalEditProd(true)
                }}>ubah</button>
                <button style={{ marginLeft: 10 }} onClick={() => deleteProd(item.Id)}>hapus</button>
              </td>
            </tr>)
          })}
        </tbody>
      </table>
      {/* pagination */}
      <br />
      <div>
        <button style={{ marginRight: 10 }}
          onClick={() => {
            setPage(page != 1 ? page - 1 : 1)
          }}
        >
          prev page
        </button>
        {totalPage < 10 &&
          arrayPages.map((item, index) => {
            return <button style={{ marginLeft: index != 0 ? 5 : 0 }} onClick={() => setPage(index + 1)} >{index + 1}</button>
          })
        }
        <button style={{ marginLeft: 10 }}
          onClick={() => {
            setPage(page != totalPage ? page + 1 : 1)
          }}
        >
          next page
        </button>
      </div>

      {/* modal add product */}
      <Modal
        isOpen={modalAddProd}
        style={modalStyles}
      >
        <button style={{ position: 'absolute', right: 10, top: 10 }} onClick={() => setModalAddProd(false)}>close</button>
        <h1>Tambah Produk</h1>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <input placeholder='Masukkan nama produk baru' onChange={(val) => setNewName(val.target.value)} ></input>
          <br />
          <select value={category} onChange={(val) => setNewCategory(val.target.value)} name="Product_Category" className="select-box" >
            <option value="" >Pilih Kategori</option>
            <option value="Rokok" >Rokok</option>
            <option value="Obat" >Obat</option>
            <option value="Lainnya" >Lainnya</option>
          </select>
          <br />
          <textarea placeholder='Masukkan deskripsi produk baru' onChange={(val) => setNewDesc(val.target.value)}></textarea>
          <br />
          <div>
          <h6>Product Price: </h6>
          {newProductPrices.map((item,index) => {
            return (
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'lightGrey', padding: 5, marginBottom: 10}} >
                <input placeholder='Unit' onChange={(val) => setNewProductPrice(val.target.value, index)} ></input>
                <br />
                {item.PriceDetails.map((item, idx) => {
                  return (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      {/* <input placeholder='Tier' onChange={(val) => setNewProductPriceDetailTier(val.target.value, index, idx)} ></input> */}
                      <select  onChange={(val) => setNewProductPriceDetailTier(val.target.value, index, idx)} name="Tier" className="select-box" >
                        <option value="" >Pilih Tier</option>
                        <option value="Non Member" >Non Member</option>
                        <option value="Basic" >Basic</option>
                        <option value="Premium" >Premium</option>
                      </select>
                      <input placeholder='Price' onChange={(val) => setNewProductPriceDetailPrice(val.target.value, index, idx)} ></input>
                    </div>
                  )
                })}
                  <br />
              </div>
            )
          })}
          <button type='button' onClick={() => addNewProductPrice()}>Tambah</button>
          <br />
          <br />
          </div>
          <button type="submit" onClick={() => addProduct()}>Tambah Produk</button>
        </form>
      </Modal>
      {/* modal edit product */}
      <Modal
        isOpen={modalEditProd}
        style={modalStyles}
      >
        <button style={{ position: 'absolute', right: 10, top: 10 }} onClick={() => setModalEditProd(false)}>close</button>
        <h1>Ubah Produk</h1>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <input placeholder='Masukkan nama produk baru' value={editedName} onChange={(val) => setEditedName(val.target.value)} ></input>
          <br />
          <select value={editedCategory} onChange={(val) => setEditedCategory(val.target.value)} name="Product_Category" className="select-box" >
            <option value={''} >Pilih Kategori</option>
            <option value="Rokok" >Rokok</option>
            <option value="Obat" >Obat</option>
            <option value="Lainnya" >Lainnya</option>
          </select>
          <br />
          <textarea value={editedDesc} placeholder='Masukkan deskripsi produk baru' onChange={(val) => setEditedDesc(val.target.value)}></textarea>
          <br />
          <button onClick={() => updateProduct()}>Ubah Produk</button>
        </form>
      </Modal>
    </div>
  );
}

export default App;

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};