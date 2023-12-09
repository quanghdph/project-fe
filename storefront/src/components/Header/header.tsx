import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag } from "react-feather"
import Logo from "../../assets/logo/logo-01.png";
import {
    useDisclosure,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/axios/axiosInstance";
import { logOut } from "src/features/auth/action";
import Cart from "./Cart";

const Header = () => {
    // ** State
    const [show, setShow] = React.useState<string>()
    const [refresh, setRefresh] = React.useState<boolean>(false)

    // ** Variables
    const auth = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();
    const cart = useAppSelector((state) => state.cart)

    // ** Third party
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const { pathname } = useLocation()
    const navigate = useNavigate();

    // ** Effect
    React.useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, []);

    // ** Function handle
    const controlNavbar = () => {
        if (window.scrollY > 80) {
            setShow("!bg-white !shadow");
        } else {
            setShow("");
        }
    };

    return (
        <React.Fragment>
            <header className={pathname != '/' ? `sticky shadow lg:fixed top-0 bg-white z-50 w-full transition duration-200 ${show}` : `sticky shadow lg:fixed lg:shadow-none top-0 bg-white lg:bg-transparent z-50 w-full transition duration-200 ${show}`}>
                <div className="flex px-4 mx-auto h-16 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm justify-between items-center">
                    <div className="flex items-center gap-8">
                        <nav className="shrink-0">
                            <Link to="/" className="logo">
                                <img src={Logo} alt="img-logo" />
                            </Link>
                        </nav>
                        <ul className="hidden lg:flex m-0">
                            <li className="p-4">
                                <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/products">Product</Link>
                            </li>
                            <li className="p-4">
                                <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/about">About</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex gap-5">
                        {
                            localStorage.getItem("accessToken") ? (
                                <div className="cursor-pointer relative">
                                    <ShoppingBag size={24} onClick={() => onOpen()} />
                                    <div className="bg-primary absolute -top-1 -right-1 text-white text-[0.625rem] font-medium subpixel-antialiased flex items-center justify-center leading-none rounded-full w-4 h-4">
                                        <span>{!cart.listProductOnCart.loading && cart.listProductOnCart.result ? cart.listProductOnCart.result?.length : 0}</span>
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className="cursor-pointer flex flex-row gap-1">
                            {
                                localStorage.getItem("accessToken") ? (
                                    <div className="flex items-end justify-center">
                                        <Menu>
                                            <MenuButton as={"span"}>
                                                Hi, {!auth.login.loading && auth.login.result ? auth.login.result.first_name + auth.login.result.last_name : ''}
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={() => { navigate('/account') }}>My account</MenuItem>
                                                <MenuItem onClick={() => logOut(dispatch, navigate, axiosClientJwt, toast)}>Logout</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </div>
                                ) : (
                                    <Link to="/login" className="font-semibold">Sign In</Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </header>
            <Cart isOpen={isOpen} onClose={onClose} refresh={refresh} setRefresh={setRefresh} />
        </React.Fragment>
    );
};

export default Header;