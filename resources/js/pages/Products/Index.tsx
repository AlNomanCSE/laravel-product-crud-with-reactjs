import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    created_at: string;
}

interface Flash {
    success?: string | null;
}

interface Props {
    products: Product[];
    auth?: {
        user: {
            name: string;
        } | null;
    };
    flash?: Flash;
}

export default function Index({ products }: Props) {
    const { props } = usePage<{ flash?: Flash }>();
    const [showSuccess, setShowSuccess] = useState(false);
    useEffect(() => {
        if (props.flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000); // 5 seconds

            return () => clearTimeout(timer);
        }
    }, [props.flash?.success]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {showSuccess && props.flash?.success && (
                    <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className='text-green-700 dark:text-green-400'>Success!</AlertTitle>
                        <AlertDescription className='text-green-600 dark:text-green-300'>
                            {props.flash.success}
                        </AlertDescription>
                    </Alert>
                )}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
                    <Link href="/products/create">
                        <Button>Create Product</Button>
                    </Link>
                </div>
                {products.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No products available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {product.description || 'No description'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">৳{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.created_at}</td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>
                                            <div className='flex gap-2'>
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                                                    onBefore={() => confirm('Are you sure you want to delete this post?')}
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

