"use client"
import MainLayout from "../layouts/MainLayout";

export default function Discover() {
    return (
        <MainLayout>
            <section className="p-4 flex flex-col items-center justify-center w-full">
                <svg width="12em" data-e2e height="12em" viewBox="0 0 36 36" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18 30.375C24.8345 30.375 30.375 24.8345 30.375 18C30.375 11.1655 24.8345 5.625 18 5.625C11.1655 5.625 5.625 11.1655 5.625 18C5.625 24.8345 11.1655 30.375 18 30.375ZM21.3223 19.4671C21.2331 19.9188 20.9578 20.312 20.5638 20.5503L13.9071 24.5756C13.5424 24.7961 13.0892 24.4788 13.1717 24.0606L14.6776 16.4287C14.7667 15.977 15.042 15.5837 15.436 15.3455L22.0927 11.3202C22.4574 11.0997 22.9106 11.417 22.8281 11.8351L21.3223 19.4671Z" /><path d="M16.4392 20.1662L18.9851 18.6267L19.5611 15.7077L17.0151 17.2473L16.4392 20.1662Z" /></svg>
                <div className="text-4xl text-white">Discover</div>
                <p className="text-lg text-gray-400">Comming soon ...</p>
            </section>
        </MainLayout>
    );
};