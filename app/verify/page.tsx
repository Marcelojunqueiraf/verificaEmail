"use client";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

import { useSearchParams, redirect } from "next/navigation";
import { Suspense } from "react";

export default function Verify() {
  return (
    <div>
      <h1>Verifique seu email</h1>
      <Suspense>
        <VerifyForm></VerifyForm>
      </Suspense>
    </div>
  );
}

function VerifyForm() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const initialValues = {
    email: email || "",
    code: code || "",
  };

  const router = useRouter();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      console.log(values);
      const response = await axios.post("/api/verify-code", values);
      router.push("/verified");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor="email">Email</label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component="div" />

          <label htmlFor="code">Code</label>
          <Field type="text" id="code" name="code" />
          <ErrorMessage name="code" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
