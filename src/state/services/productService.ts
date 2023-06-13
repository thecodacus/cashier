import { IProduct } from '../../models/IProduct'
import { baseService } from './baseService'

const productService = baseService.injectEndpoints({
    endpoints: (build) => ({
        getAllProducts: build.query<IProduct[], void>({
            query: () => ({
                url: 'get_all_products',
                method: 'POST',
                body: {},
            }),
            providesTags: (result) =>
                result ? [...result.map(({ code }) => ({ type: 'Products' as const, id: code })), 'Products']
                    : ['Products']
        }),
        getProductByCode: build.query<IProduct, string>({
            query: (code) => ({
                url: 'get_product_by_code',
                method: 'POST',
                body: { code },
            }),
        }),
        addProduct: build.mutation<boolean, IProduct>({
            query: (product) => ({
                url: 'save_product',
                method: 'POST',
                body: { product },
            }),
            invalidatesTags: ['Products'],
        }),
        saveProduct: build.mutation<boolean, IProduct>({
            query: (product) => ({
                url: 'save_product',
                method: 'POST',
                body: { product },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Products', id: arg.code }],
        }),
        deleteProduct: build.mutation<boolean, string>({
            query: (code) => ({
                url: 'delete_product',
                method: 'POST',
                body: { code },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Products', id: arg }],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetAllProductsQuery,
    useGetProductByCodeQuery,
    useSaveProductMutation,
    useAddProductMutation,
    useDeleteProductMutation
} = productService