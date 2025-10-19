import {
  ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalImage, ModalTitle,
  ModalPrice, ModalStock, StockIndicator, ModalQuantityWrapper, ModalQuantityControl,
  ModalQuantityButton, ModalQuantityInputWrapper, ModalQuantityInput, ModalFooter,
  CancelButton, AddToCartButton,
} from './styles';
import { formatPrice } from '../../utils/formatPrice';
import type { ProductModalState } from '../../types/cart';

interface ProductModalProps {
  productModal: ProductModalState;
  closeProductModal: () => void;
  handleQuantityChange: (quantity: number) => void;
  addToCartFromModal: () => void;
}

export const ProductModal = ({
  productModal,
  closeProductModal,
  handleQuantityChange,
  addToCartFromModal,
}: ProductModalProps) => {
  if (!productModal.isOpen || !productModal.product) return null;

  const { product, quantity } = productModal;

  return (
    <ModalOverlay onClick={closeProductModal}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalCloseButton onClick={closeProductModal}>&times;</ModalCloseButton>

        <ModalHeader>
          <ModalImage>
            <span>{product.image || '📦'}</span>
          </ModalImage>
          <ModalTitle>{product.name}</ModalTitle>
          <ModalPrice>
            <span>₱</span>
            {formatPrice(product.price)}
          </ModalPrice>
          <ModalStock>
            <StockIndicator available={product.stock > 10} />
            {product.stock} available in stock
          </ModalStock>
        </ModalHeader>

        <ModalQuantityWrapper>
          <ModalQuantityControl>
            <ModalQuantityButton 
              onClick={() => handleQuantityChange(quantity - 1)} 
              disabled={quantity <= 1}
            >
              -
            </ModalQuantityButton>
            <div style={{ minWidth: '60px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 600 }}>
              {quantity}
            </div>
            <ModalQuantityButton 
              onClick={() => handleQuantityChange(quantity + 1)} 
              disabled={quantity >= product.stock}
            >
              +
            </ModalQuantityButton>
          </ModalQuantityControl>
          <ModalQuantityInputWrapper>
            <span style={{ fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>Custom amount:</span>
            <ModalQuantityInput
              type="number"
              min="1"
              max={product.stock || 1}
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value > 0 && value <= product.stock) {
                  handleQuantityChange(value);
                }
              }}
            />
          </ModalQuantityInputWrapper>
        </ModalQuantityWrapper>

        <ModalFooter>
          <CancelButton onClick={closeProductModal}>Cancel</CancelButton>
          <AddToCartButton onClick={() => { addToCartFromModal(); closeProductModal(); }}>
            Add to Cart - ₱{formatPrice(product.price * quantity)}
          </AddToCartButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
