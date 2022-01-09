import '/views/style.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Inventory, InventoryOid } from 'src/inventory/inventory.schema';
import ContentEditable from 'react-contenteditable';

type Item = Inventory & { _id: InventoryOid; createdAt: Date; updatedAt: Date };

const ItemRow = ({
  item,
  onSubmit,
}: {
  item: Item;
  key: string;
  onSubmit: (item: Inventory, id?: InventoryOid) => void;
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  // suppressContentEditableWarning contentEditable={editMode}
  return (
    <tr>
      <td>
        <code>{item._id.substring(18)}</code>
      </td>
      <td>
        <div>{item.name}</div>
      </td>
      <td>
        <div>{item.brand}</div>
      </td>
      <td>
        <div>{item.description}</div>
      </td>
      <td>
        <div>{item.price.toFixed(2)}</div>
      </td>
      <td>
        <div>{item.quantity}</div>
      </td>
      <td>
        <div>{item.tags.join(', ')}</div>
      </td>
    </tr>
  );
};

const NewItemInput = ({
  onSubmit,
}: {
  onSubmit: (item: Inventory, id?: InventoryOid) => void;
}) => {
  const nameRef = useRef();
  const brandRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const tagsRef = useRef();

  const [item, setItem] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    tags: '',
  });

  const submit = () => {
    onSubmit({
      name: item.name.replaceAll('&nbsp;', '').replaceAll('<br>', '').trim(),
      description: item.description
        .replaceAll('&nbsp;', '')
        .replaceAll('<br>', '')
        .trim(),
      brand: item.brand.replaceAll('&nbsp;', '').replaceAll('<br>', '').trim(),
      price: +item.price,
      quantity: 1,
      tags: [
        ...new Set<string>(
          item.tags
            .toLowerCase()
            .split(',')
            .map(
              (tag) =>
                tag.replaceAll('&nbsp;', '').replaceAll('<br>', '').trim() + ''
            )
        ),
      ],
    });
  };

  return (
    <tr>
      <td>
        <button onClick={submit}>SUBMIT</button>
      </td>
      <td>
        <ContentEditable
          innerRef={nameRef}
          tagName="div"
          html={item.name}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            document.execCommand('insertText', false, text);
          }}
          onChange={(e) => {
            setItem((item) => ({ ...item, name: e.target.value }));
          }}
        />
      </td>
      <td>
        <ContentEditable
          innerRef={brandRef}
          tagName="div"
          html={item.brand}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            document.execCommand('insertText', false, text);
          }}
          onChange={(e) => {
            setItem((item) => ({ ...item, brand: e.target.value }));
          }}
        />
      </td>
      <td>
        <ContentEditable
          innerRef={descriptionRef}
          tagName="div"
          html={item.description}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            document.execCommand('insertText', false, text);
          }}
          onChange={(e) => {
            setItem((item) => ({ ...item, description: e.target.value }));
          }}
        />
      </td>
      <td>
        <ContentEditable
          innerRef={priceRef}
          tagName="div"
          html={item.price}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            document.execCommand('insertText', false, text);
          }}
          onChange={(e) => {
            setItem((item) => ({ ...item, price: e.target.value }));
          }}
        />
      </td>
      <td>1</td>
      <td>
        <ContentEditable
          innerRef={tagsRef}
          tagName="div"
          html={item.tags}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            document.execCommand('insertText', false, text);
          }}
          onChange={(e) => {
            setItem((item) => ({ ...item, tags: e.target.value }));
          }}
        />
      </td>
    </tr>
  );
};

const Alert = ({ className, children }: any) => {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  return !showAlert ? null : (
    <div className={'alert ' + className}>
      <p>{children}</p>
      <button onClick={() => setShowAlert(false)}>×</button>
    </div>
  );
};

interface Props {
  items: Item[];
}

const Index = ({ items: _items }: Props) => {
  const [items, setItems] = useState<Inventory[]>(_items);
  const [loading, setLoading] = useState(false);
  const [showNewItem, setShowNewItem] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'API Playground (1.0) - Inventario';
  }, []);

  const refresh = async () => {
    const { data: items } = await axios.get('/inventory');
    setItems(items);
  };

  const updateItem = async (item: Inventory, id?: InventoryOid) => {
    if (!id) {
      // create new
      setShowNewItem(false);
      setLoading(true);
      try {
        await axios.post('/inventory', item);
        await refresh();
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <nav>
        <h1>Inventario</h1>
        <p>API PLAYGROUND</p>
        <div />
        <a href="/docs" target="__blank">
          Swagger Documentation
        </a>
        <a href="https://github.com/navn-r/inventario" target="__blank">
          GitHub Repository
        </a>
        <a href="https://navn.me" target="__blank" title="please hire me 🥺">
          Made with 💖 from 🍁
        </a>
      </nav>
      <main>
        <Alert className="danger">
          <strong>Warning:</strong> This public API is currently unlimited, and
          does not require authentication, please use responsibly.
        </Alert>
        <Alert className="info">
          <strong>Info:</strong> To edit an item in the inventory, click on its
          ID. Tags are comma separated.
        </Alert>
        <header>
          <div>
            <h5>VERSION 1.0</h5>
            <h2>Inventory Items</h2>
          </div>
          <button className="refresh" onClick={refresh}>
            Refresh
          </button>
          <button
            className={showNewItem ? 'abort' : ''}
            onClick={() =>
              setShowNewItem((showNewItem: boolean) => !showNewItem)
            }
          >
            {showNewItem ? 'Abort Changes' : 'New Item'}
          </button>
          <a className="button" href="/inventory/export">
            Export (CSV)
          </a>
        </header>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <ItemRow key={item._id} item={item} onSubmit={updateItem} />
              ))
            ) : !showNewItem ? (
              <tr>
                <td colSpan="100%" align="center">
                  No inventory items found.
                </td>
              </tr>
            ) : null}
            {showNewItem ? <NewItemInput onSubmit={updateItem} /> : null}
            {loading ? (
              <tr>
                <td colSpan="100%" align="center">
                  Loading...
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default Index;
