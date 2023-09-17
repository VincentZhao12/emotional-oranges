import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <h3>
                    <Link
                        to="/"
                        style={{
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        Emotional Oranges
                    </Link>
                </h3>
            </div>
            <hr />
        </div>
    );
};

export default Navbar;
