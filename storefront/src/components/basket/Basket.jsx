/* eslint-disable max-len */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { BasketItem, BasketToggle } from "@/components/basket";
import { Boundary, Modal } from "@/components/common";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
// import firebase from 'firebase/firebase';
import { calculateTotal, displayMoney } from "@/helpers/utils";
import { useDidMount, useModal } from "@/hooks";
import { clearBasket } from "@/redux/actions/basketActions";

const Basket = () => {
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { basket, user, store } = useSelector((state) => ({
    basket: state.basket,
    user: state.auth,
    store: state,
  }));
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();
console.log(store);
  useEffect(() => {
    if (didMount && basket.length !== 0) {
      // firebase.saveBasketItems(basket, firebase.auth.currentUser.uid)
      //   .then(() => {
      //     console.log('Item saved to basket');
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    }
  }, [basket.length]);

  const onCheckOut = () => {
    console.log(basket);
    if (basket.length !== 0 && user) {
      document.body.classList.remove("is-basket-open");
      history.push(CHECKOUT_STEP_1);
    } else {
      onOpenModal();
    }
  };

  const onSignInClick = () => {
    onCloseModal();
    document.body.classList.remove("basket-open");
    history.push(CHECKOUT_STEP_1);
  };

  const onClearBasket = () => {
    if (basket.length !== 0) {
      dispatch(clearBasket());
    }
  };

  return user && user.role === "ADMIN" ? null : (
    <Boundary>
      <Modal isOpen={isOpenModal} onRequestClose={onCloseModal}>
        <p className="text-center">You must sign in to continue checking out</p>
        <br />
        <div className="d-flex-center">
          <button
            className="button button-border button-border-gray button-small"
            onClick={onCloseModal}
            type="button"
          >
            Continue shopping
          </button>
          &nbsp;
          <button
            className="button button-small"
            onClick={onSignInClick}
            type="button"
          >
            Sign in to checkout
          </button>
        </div>
      </Modal>
      <div className="basket">
        <div className="basket-list">
          <div className="basket-header">
            <h3 className="basket-header-title">
              Giỏ hàng &nbsp;
              <span>({` ${basket ? basket.length : 0} sản phẩm`})</span>
            </h3>
            <BasketToggle>
              {({ onClickToggle }) => (
                <span
                  className="basket-toggle button button-border button-border-gray button-small"
                  onClick={onClickToggle}
                  role="presentation"
                >
                  Đóng
                </span>
              )}
            </BasketToggle>
            <button
              className="basket-clear button button-border button-border-gray button-small"
              disabled={basket.length === 0}
              onClick={onClearBasket}
              type="button"
            >
              <span>Xóa giỏ hàng</span>
            </button>
          </div>
          {basket.length <= 0 && (
            <div className="basket-empty">
              <h5 className="basket-empty-msg">
                Không có sản phẩm nào trong giỏ
              </h5>
            </div>
          )}
          {basket && basket?.map((product, i) => {
            // const productCustom = {
            //   ...product,
            //   productDetail: {
            //     ...product.productDetail,
            //     cartQuantity: 1,
            //   }
            // };
            return (
              <BasketItem
                // eslint-disable-next-line react/no-array-index-key
                key={`${product.productDetail?.id}_${i}`}
                product={product.productDetail}
                basket={basket}
                dispatch={dispatch}
              />
            );
          })}
        </div>
        <div className="basket-checkout">
          <div className="basket-total">
            <p className="basket-total-title">Tổng đơn:</p>

            {/* {product ? (
              <h2 className="basket-total-amount">
                {displayMoney(
                  calculateTotal(
                    basket.map((product) => product.price * product.quantity)
                  )
                )}
              </h2>
            ) : (
              <h2 className="basket-total-amount">
                {displayMoney(
                  calculateTotal(
                    basket.map(
                      (product) =>
                        product.productDetail.price *
                        product.productDetail.quantity
                    )
                  )
                )}
              </h2>
            )} */}
             <h2 className="basket-total-amount">
                {displayMoney(
                  calculateTotal(
                    basket && basket?.map(
                      (product) =>
                        product.productDetail.price *
                        product.productDetail.cartQuantity
                    )
                  )
                )}
              </h2>
          </div>
          <button
            className="basket-checkout-button button"
            disabled={basket.length === 0 || pathname === "/checkout"}
            onClick={onCheckOut}
            type="button"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </Boundary>
  );
};

export default Basket;
