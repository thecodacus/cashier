import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IInvoice, ILineItem, PaymentMode } from '../../models/IInvoice'
import { baseService } from './baseService'
import { ICustomer } from '@src/models/ICustomer'


const invoiceService = baseService.injectEndpoints({
    endpoints: (build) => ({
        getAllInvoices: build.query<IInvoice[], void>({
            query: () => ({
                url: 'get_all_invoices',
                method: 'POST',
                body: {},
            }),
            providesTags: (result) =>
                result ? [...result.map(({ number }) => ({ type: 'Invoices' as const, id: number })), 'Invoices']
                    : ['Invoices']
        }),
        getInvoiceByNumber: build.query<IInvoice, string>({
            query: (code) => ({
                url: 'get_invoice_by_number',
                method: 'POST',
                body: { code },
            }),
        }),
        addInvoice: build.mutation<boolean, IInvoice>({
            query: (invoice) => ({
                url: 'save_invoice',
                method: 'POST',
                body: { invoice },
            }),
            invalidatesTags: ['Invoices'],
        }),
        saveInvoice: build.mutation<boolean, IInvoice>({
            query: (invoice) => ({
                url: 'save_invoice',
                method: 'POST',
                body: { invoice },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Invoices', id: arg.number }],
        }),
        deleteInvoice: build.mutation<boolean, string>({
            query: (number) => ({
                url: 'delete_invoice',
                method: 'POST',
                body: { number },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Invoices', id: arg }],
        }),
        getAllInvoiceLineItems: build.query<ILineItem[], void>({
            query: () => ({
                url: 'get_all_invoice_lineitems',
                method: 'POST',
                body: {},
            }),
            providesTags: (result) =>
                result ? [...result.map(({ id }) => ({ type: 'LineItems' as const, id: id })), 'LineItems']
                    : ['LineItems']
        }),
        saveLineItems: build.mutation<boolean, ILineItem[]>({
            query: (items) => {
                items = items.map(item => ({ ...item, id: undefined }))
                return ({
                    url: 'save_invoice_lineitems',
                    method: 'POST',
                    body: { items },
                })
            },
            invalidatesTags: ['LineItems'],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetAllInvoicesQuery,
    useGetInvoiceByNumberQuery,
    useSaveInvoiceMutation,
    useAddInvoiceMutation,
    useDeleteInvoiceMutation,
    useGetAllInvoiceLineItemsQuery,
    useSaveLineItemsMutation
} = invoiceService

function calculateInvoiceValues(lineItems: ILineItem[], invoice: IInvoice) {
    invoice.cgst = lineItems.map(x => x.cgst).reduce((a, v) => a + v, 0);
    invoice.sgst = lineItems.map(x => x.sgst).reduce((a, v) => a + v, 0);
    invoice.igst = lineItems.map(x => x.igst).reduce((a, v) => a + v, 0);
    invoice.discount = lineItems.map(x => x.discount).reduce((a, v) => a + v, 0);
    invoice.profit = lineItems.map(x => x.profit).reduce((a, v) => a + v, 0);
    invoice.subtotal = lineItems.map(x => x.subtotal).reduce((a, v) => a + v, 0);
    invoice.total = lineItems.map(x => x.total).reduce((a, v) => a + v, 0);
    return invoice
}
interface IError { code?: string, message?: string, stack?: string, name?: string }
interface ICheckoutState {
    invoice: {
        isLoading: boolean,
        data: IInvoice | null,
        isError: boolean,
        error: IError | null
    },
    lineItems: {
        isLoading: boolean,
        data: ILineItem[],
        isError: boolean,
        error: IError | null
    }
    buyer: {
        isLoading: boolean,
        data: ICustomer | null,
        isError: boolean,
        error: IError | null
    }
}

const initialState: ICheckoutState = {
    invoice: {
        isLoading: false,
        data: null,
        isError: false,
        error: null
    },
    lineItems: {
        isLoading: false,
        data: [],
        isError: false,
        error: null
    },
    buyer: {
        isLoading: false,
        data: null,
        isError: false,
        error: null
    }
}

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState: initialState,
    reducers: {
        newCheckout: () => initialState,
        setBuyer: (state, action: PayloadAction<ICustomer | null>) => {
            state.buyer.data = action.payload;
            if (state.buyer.data) {
                if (state.invoice.data == null) {
                    state.invoice.data = {
                        date: Date.now(),
                        buyer_id: state.buyer.data.phone,
                        subtotal: 0,
                        discount: 0,
                        profit: 0,
                        cgst: 0,
                        sgst: 0,
                        igst: 0,
                        total: 0
                    }
                }
            }
        },
        deaftInvoice: (state) => {
            state = initialState;
            state.invoice.data = {
                date: Date.now(),
                buyer_id: state.buyer.data?.phone || 0,
                subtotal: 0,
                discount: 0,
                profit: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                total: 0
            }
            state.lineItems.data = []
        },
        addLineItem: (state, action: PayloadAction<ILineItem>) => {
            state.lineItems.data.push(action.payload)
            if (!state.invoice.data) return;
            state.invoice.data = calculateInvoiceValues(state.lineItems.data, state.invoice.data)
        },
        updateLineItem: (state, action: PayloadAction<ILineItem>) => {
            state.lineItems.data = state.lineItems.data.map(item => {
                if (item.id == action.payload.id) return action.payload;
                else return item
            })
            if (!state.invoice.data) return;
            state.invoice.data = calculateInvoiceValues(state.lineItems.data, state.invoice.data)
        },
        collectPayment: (state, action: PayloadAction<PaymentMode>) => {
            if (!state.invoice.data) return;
            state.invoice.data.paid_by = action.payload
        }
    },
    extraReducers: builder => {
        builder.addMatcher(invoiceService.endpoints.getAllInvoiceLineItems.matchPending, (state) => {
            state.lineItems.isLoading = true;

        }).addMatcher(invoiceService.endpoints.getAllInvoiceLineItems.matchFulfilled, (state, action) => {
            state.lineItems.isLoading = false;
            state.lineItems.data = action.payload;
            state.lineItems.isError = false;
            state.lineItems.error = null;
        }).addMatcher(invoiceService.endpoints.getAllInvoiceLineItems.matchRejected, (state, action) => {
            state.lineItems.isLoading = false;
            state.lineItems.data = [];
            state.lineItems.isError = false;
            state.lineItems.error = action.error;
        })
    }
})

export const {
    newCheckout,
    setBuyer,
    deaftInvoice,
    addLineItem,
    updateLineItem,
    collectPayment
} = checkoutSlice.actions;


