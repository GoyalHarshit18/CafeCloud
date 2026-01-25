import { useState } from 'react';
import { usePOS } from '@/hooks/use-pos';
import { categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    ChevronRight,
    MoreVertical,
    Filter
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const ProductsScreen = () => {
    const { products, addProduct, updateProduct, deleteProduct } = usePOS();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'pizza',
        description: '',
        image: '',
    });

    const filteredProducts = products.filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleOpenDialog = (product?: any) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                description: product.description || '',
                image: product.image || '',
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                category: 'pizza',
                description: '',
                image: '',
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            price: parseFloat(formData.price),
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, data);
                toast({ title: 'Product Updated', description: `${data.name} has been updated successfully.` });
            } else {
                await addProduct(data);
                toast({ title: 'Product Added', description: `${data.name} has been added to the menu.` });
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save product.', variant: 'destructive' });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteProduct(id);
                toast({ title: 'Product Deleted', description: `${name} has been removed.` });
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to delete product.', variant: 'destructive' });
            }
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
                    <p className="text-muted-foreground">Manage your products and categories</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-card"
                        />
                    </div>
                    <Button onClick={() => handleOpenDialog()} className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        New Product
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="whitespace-nowrap px-6 rounded-full"
                    >
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                    </Button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative"
                        >
                            <div className="aspect-[4/3] overflow-hidden bg-secondary">
                                <img
                                    src={p.image || '/placeholder-food.jpg'}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                                    <span className="font-mono font-bold text-primary">₹{p.price}</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                    {p.description || 'No description available.'}
                                </p>
                                <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={() => handleOpenDialog(p)}
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(p.id, p.name)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Cheese Pizza"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price (₹)</label>
                                    <Input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="299"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.filter(c => c.id !== 'all').map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URL</label>
                                <Input
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the item"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingProduct ? 'Save Changes' : 'Add Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
