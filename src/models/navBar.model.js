import { Schema, model } from "mongoose";

const navBarSchema = new Schema(
    {
        navBarLinks: [
            {
                key: {
                    type: String,
                    trim: true,
                    
                },

                type: {
                    type: String,
                    trim: true,
                    requried: true,
                },

                menus: [
                    {
                        label: {
                            type: String,
                            trim: true,
                            
                        },
                        path: {
                            type: String,
                            trim: true,
                            
                        },
                    },
                ],

                path: {
                    type: String,
                    trim: true,
                },

                isVisible: {
                    type: Boolean,
                    default: false,
                },

                showAt: {
                    type: String,
                    enum: ["NAVBAR", "FOOTER", "BOTH"],
                },
            },
        ],
    },
    { timestamps: true, collection: "NavBar" }
);

const NavBar = model("NavBar", navBarSchema);

export default NavBar;
