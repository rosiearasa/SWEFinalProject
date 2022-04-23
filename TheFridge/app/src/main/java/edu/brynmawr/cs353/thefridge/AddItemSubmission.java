package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

public class AddItemSubmission extends AppCompatActivity {

    String user = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");
        setContentView(R.layout.activity_item_submission);
    }

    public void onAnotherItem(View view) {
        Intent intent = new Intent(this, AddItemActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    public void onGoHome(View view) {
        Intent intent = new Intent(this, HomePageActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

}
