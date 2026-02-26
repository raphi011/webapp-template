"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { createPostAction } from "@/app/lib/actions/posts";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("dashboard");

  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
      loading={pending}
    >
      {t("createPost")}
    </Button>
  );
}

function CreatePostForm() {
  const t = useTranslations("dashboard");
  const [state, formAction] = useActionState(createPostAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.success && (
        <p className="text-sm text-green-600 dark:text-green-400" role="status">
          {t("postCreated")}
        </p>
      )}
      {state && !state.success && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <FormField
        label={t("postTitle")}
        required
        inputProps={{ name: "title", maxLength: 200 }}
      />

      <FormField
        label={t("postContent")}
        type="textarea"
        required
        inputProps={{ name: "content", maxLength: 10000, rows: 4 }}
      />

      <SubmitButton />
    </form>
  );
}

export { CreatePostForm };
