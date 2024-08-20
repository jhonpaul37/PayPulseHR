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
                        {/* fund cluster DONE*/}
                        <input
                            value={data.f_cluster}
                            type="text"
                            // drop down content from database

                            onChange={(e) =>
                                setData('f_cluster', e.target.value)
                            }
                            placeholder="fund cluster"
                            className={errors.f_cluster && '!ring-red-500'}
                        />
                        {errors.f_cluster && (
                            <div className="text-red-600">
                                {errors.f_cluster}
                            </div>
                        )}
                        {/* ors_burs_no DONE*/}
                        <input
                            value={data.ors_burs_no}
                            type="number"
                            onChange={(e) =>
                                setData('ors_burs_no', e.target.value)
                            }
                            placeholder="ors_burs_no"
                            className={errors.ors_burs_no && '!ring-red-500'}
                        />
                        {errors.ors_burs_no && (
                            <div className="text-red-600">
                                {errors.ors_burs_no}
                            </div>
                        )}
                        {/* jev_num DONE*/}
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
                        {/* div_num DONE*/}
                        <input
                            value={data.div_num}
                            type="text"
                            onChange={(e) => setData('div_num', e.target.value)}
                            placeholder="div_num"
                            className={errors.div_num && '!ring-red-500'}
                        />
                        {errors.jev_no && (
                            <div className="text-red-600">{errors.div_num}</div>
                        )}
                        {/* uacs_code DONE*/}
                        <input
                            value={data.uacs_code}
                            type="number"
                            onChange={(e) =>
                                setData('uacs_code', e.target.value)
                            }
                            placeholder="uacs_code"
                            className={errors.uacs_code && '!ring-red-500'}
                        />
                        {errors.uacs_code && (
                            <div className="text-red-600">
                                {errors.uacs_code}
                            </div>
                        )}
                        {/* user_id */}
                        <input
                            value={data.user_id}
                            type="number"
                            onChange={(e) => setData('user_id', e.target.value)}
                            placeholder="user_id"
                            className={errors.user_id && '!ring-red-500'}
                        />
                        {errors.jev_no && (
                            <div className="text-red-600">{errors.user_id}</div>
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
