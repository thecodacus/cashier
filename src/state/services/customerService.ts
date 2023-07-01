import { ICustomer } from '../../models/ICustomer'
import { baseService } from './baseService'


const customerService = baseService.injectEndpoints({
    endpoints: (build) => ({
        getAllCustomers: build.query<ICustomer[], void>({
            query: () => ({
                url: 'get_all_customers',
                method: 'POST',
                body: {},
            }),
            providesTags: (result) =>
                result ? [...result.map(({ phone }) => ({ type: 'Customers' as const, id: phone })), 'Customers']
                    : ['Customers']
        }),
        getCustomerById: build.query<ICustomer | null, number>({
            query: (id) => ({
                url: 'get_customer_by_id',
                method: 'POST',
                body: { id },
            }),
            providesTags: (result) =>
                result ? [{ type: 'Customers' as const, id: result.phone }]
                    : ['Customers']
        }),
        addCustomer: build.mutation<boolean, ICustomer>({
            query: (customer) => ({
                url: 'save_customer',
                method: 'POST',
                body: { customer },
            }),
            invalidatesTags: ['Customers'],
        }),
        saveCustomer: build.mutation<boolean, ICustomer>({
            query: (customer) => ({
                url: 'save_customer',
                method: 'POST',
                body: { customer },
            }),
            invalidatesTags: ['Customers'],
        }),
        deleteCustomer: build.mutation<boolean, string>({
            query: (number) => ({
                url: 'delete_customer',
                method: 'POST',
                body: { number },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Customers', id: arg }],
        })
    }),
    overrideExisting: false,
})

export const {
    useGetAllCustomersQuery,
    useGetCustomerByIdQuery,
    useSaveCustomerMutation,
    useAddCustomerMutation,
    useDeleteCustomerMutation
} = customerService

export const {
    getCustomerById,
} = customerService.endpoints

