import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products_count: number;
    created_at: string;
}

interface Flash {
    success?: string | null;
}

interface Filters {
    search?: string | null;
}

interface Props {
    categories: Category[];
    filters: Filters;
}

export default function Index({ categories, filters }: Props) {
    const { props } = usePage<{ flash?: Flash }>();
    const [showSuccess, setShowSuccess] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (props.flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [props.flash?.success]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/categories', { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get('/categories', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
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

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:flex-initial">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search categories..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100"
                                />
                            </div>
                            <Button type="submit" variant="outline">
                                Search
                            </Button>
                            {search && (
                                <Button type="button" variant="outline" onClick={handleClearSearch}>
                                    Clear
                                </Button>
                            )}
                        </form>
                        <Link href="/categories/create">
                            <Button>Create Category</Button>
                        </Link>
                    </div>
                </div>

                {categories.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        {search ? `No categories found matching "${search}".` : 'No categories available.'}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Products</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {category.description || 'No description'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {category.products_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{category.created_at}</td>
                                        <td className='px-4 py-2'>
                                            <div className='flex gap-2'>
                                                <Link
                                                    href={`/categories/${category.id}/edit`}
                                                    className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/categories/${category.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                                                    onBefore={() => confirm('Are you sure you want to delete this category?')}
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