// import '@/styles/globals.css'
import '@/styles/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.teal.light.compact.css';
import store from '@/redux/config'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import Loading from '@/components/loading';

const queryClient = new QueryClient()
const persistor = persistStore(store)

export default function App({ Component, pageProps }) {
  return (
    <>
      <div className='App'>
        <Loading store={store} />
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <PersistGate persistor={persistor}>
              <Component {...pageProps} store={store} />
            </PersistGate>
            <ReactQueryDevtools initialIsOpen={true} />
          </QueryClientProvider>
        </Provider>
      </div>
    </>
  )
}
