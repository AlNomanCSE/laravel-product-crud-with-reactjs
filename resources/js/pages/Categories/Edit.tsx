import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface Flash {
    success?: string | null;
    error?: string | null;
}

interface Props {
    category: Category;
}

export default function EditCategory({ category }: Props) {
    const { props } = usePage<{ flash?: Flash }>();
    const [showSuccess, setShowSuccess] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
    });

    useEffect(() => {
        if (props.flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [props.flash?.success]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />
            <div className='p-6 flex items-center justify-center min-h-screen relative'>
                <div className='max-w-lg w-full p-6 dark:border rounded-lg shadow-md'>
                    <Link
                        href="/categories"
                        className='absolute top-6 right-6 inline-flex items-center px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm'
                    >
                        Back to Categories
                    </Link>

                    {showSuccess && props.flash?.success && (
                        <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className='text-green-700 dark:text-green-400'>Success!</AlertTitle>
                            <AlertDescription className='text-green-600 dark:text-green-300'>
                                {props.flash.success}
                            </AlertDescription>
                        </Alert>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <Alert className="mb-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                            <CircleAlert className="h-4 w-4 text-red-600" />
                            <AlertTitle className='text-red-700 dark:text-red-400'>Error!</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside text-red-600 dark:text-red-300">
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center'>Edit Category</h1>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Category Name</label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100'
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Description</label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100'
                                rows={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className='w-full px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200 text-lg'
                        >
                            {processing ? 'Updating...' : 'Update Category'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}