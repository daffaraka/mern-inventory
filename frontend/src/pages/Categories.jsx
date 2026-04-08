import { useState, useEffect } from "react";


import categoryServices from "../services/categoryService";
import Button from "../components/common/Button";


const Category = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [user, setUser] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);


    const fetchCategory = async () => {
        try {
            
        } catch (error) {
            
        }
    }
}