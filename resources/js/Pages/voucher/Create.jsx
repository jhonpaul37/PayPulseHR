import { useForm } from '@inertiajs/react';
import DOMPurify from 'dompurify';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        jev_no: '',
        f_cluster: '',
        ors_vurs_no: '',
        div_num: '',
        uacs_code: '',
        user_id: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/voucher');
    }

    return (
        <>
            <div className="px-20 pt-10">
                <h1>create a new voucher</h1>

                {/* Testing purpose */}
                {/* {data.f_cluster} */}
                {/* Testing end */}

                <div>
                    <form onSubmit={submit}>
                        {/* fund cluster */}
                        <input
                            value={data.f_cluster}
                            type="text"
                            // same code with handleInputChange

                            onChange={(e) =>
                                setData('f_cluster', e.target.value)
                            }
                            placeholder="Enter cluster"
                            className={errors.f_cluster && '!ring-red-500'}
                        />
                        {errors.f_cluster && (
                            <div className="text-red-600">
                                {errors.f_cluster}
                            </div>
                        )}

                        {/* jev_num */}
                        <input
                            value={data.jev_no}
                            type="text"
                            onChange={(e) => setData('jev_no', e.target.value)}
                            placeholder="jev_no"
                            className={errors.jev_no && '!ring-red-500'}
                        />
                        {errors.jev_no && (
                            <div className="text-red-600">{errors.jev_no}</div>
                        )}
                        {/* submit button */}
                        <button
                            disabled={processing}
                            className="rounded-md bg-high px-10 py-3 font-bold"
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
